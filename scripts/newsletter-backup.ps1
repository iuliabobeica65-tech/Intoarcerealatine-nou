#requires -Version 7.4
[CmdletBinding()]
param(
 [Parameter(Mandatory)][ValidateSet('Protect','Restore')][string]$Action,
 [Parameter(Mandatory)][string]$InputPath,
 [Parameter(Mandatory)][string]$OutputPath,
 [Parameter(Mandatory)][Security.SecureString]$Password
)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression
$privateRoot=[IO.Path]::GetFullPath((Join-Path (Split-Path $PSScriptRoot -Parent) '.local/newsletter-private'))
function PrivatePath([string]$Value){
 $p=[IO.Path]::GetFullPath($Value)
 if(-not $p.StartsWith($privateRoot+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Path must be inside .local/newsletter-private.'}
 $cursor=$p
 while($cursor -and $cursor.Length -ge $privateRoot.Length){
  if((Test-Path -LiteralPath $cursor) -and ((Get-Item -LiteralPath $cursor -Force).Attributes -band [IO.FileAttributes]::ReparsePoint)){throw 'Linked paths are not permitted.'}
  $cursor=[IO.Path]::GetDirectoryName($cursor)
 }
 return $p
}
$inputResolved=PrivatePath $InputPath
$outputResolved=PrivatePath $OutputPath
if(Test-Path -LiteralPath $outputResolved){throw 'Output already exists; nothing is overwritten.'}
if($outputResolved.StartsWith($inputResolved+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Output must be separate from input.'}
$ptr=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
try{$passwordBytes=[Text.Encoding]::UTF8.GetBytes([Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr))}finally{[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)}
if($Password.Length -lt 16){[Array]::Clear($passwordBytes);throw 'Use a long passphrase of at least 16 characters, stored separately.'}
try{
 if($Action -eq 'Protect'){
  $groups=@('contacts','doi','dezabonari');$inventory=@{}
  foreach($group in $groups){
   $folder=Join-Path $inputResolved $group
   if(-not(Test-Path -LiteralPath $folder -PathType Container)){throw ('Missing required folder: '+$group)}
   $entries=@(Get-ChildItem -LiteralPath $folder -Recurse -Force)
   if(@($entries|Where-Object{$_.Attributes -band [IO.FileAttributes]::ReparsePoint}).Count){throw 'Linked input entries are not permitted.'}
   $files=@($entries|Where-Object{-not $_.PSIsContainer})
   if(-not $files.Count){throw ('Evidence category is empty: '+$group)}
   if(($files|Measure-Object Length -Sum).Sum -gt 104857600){throw 'Category exceeds the 100 MiB local utility limit.'}
   $inventory[$group]=$files
  }
  $null=[IO.Directory]::CreateDirectory($outputResolved);$manifest=@()
  foreach($group in $groups){
   $memory=[IO.MemoryStream]::new();$zip=[IO.Compression.ZipArchive]::new($memory,[IO.Compression.ZipArchiveMode]::Create,$true)
   try{foreach($f in $inventory[$group]){
    $name=[IO.Path]::GetRelativePath((Join-Path $inputResolved $group),$f.FullName).Replace('\','/')
    $entry=$zip.CreateEntry($name);$dest=$entry.Open();$source=$f.OpenRead()
    try{$source.CopyTo($dest)}finally{$source.Dispose();$dest.Dispose()}
   }}finally{$zip.Dispose()}
   $plain=$memory.ToArray();$memory.Dispose();$salt=[Security.Cryptography.RandomNumberGenerator]::GetBytes(16);$nonce=[Security.Cryptography.RandomNumberGenerator]::GetBytes(12)
   $key=[Security.Cryptography.Rfc2898DeriveBytes]::Pbkdf2($passwordBytes,$salt,600000,[Security.Cryptography.HashAlgorithmName]::SHA256,32)
   $cipher=[byte[]]::new($plain.Length);$tag=[byte[]]::new(16);$aad=[Text.Encoding]::UTF8.GetBytes('ER-newsletter-backup-v1:'+ $group)
   $aes=[Security.Cryptography.AesGcm]::new($key,16)
   try{$aes.Encrypt($nonce,$plain,$cipher,$tag,$aad)}finally{$aes.Dispose();[Array]::Clear($key);[Array]::Clear($plain)}
   $envelope=[ordered]@{version=1;algorithm='AES-256-GCM';kdf='PBKDF2-SHA256';iterations=600000;category=$group;salt=[Convert]::ToBase64String($salt);nonce=[Convert]::ToBase64String($nonce);tag=[Convert]::ToBase64String($tag);ciphertext=[Convert]::ToBase64String($cipher)}
   $file=Join-Path $outputResolved ($group+'.erbackup.json')
   [IO.File]::WriteAllText($file,($envelope|ConvertTo-Json -Compress),[Text.UTF8Encoding]::new($false))
   $manifest+=@{category=$group;archive=($group+'.erbackup.json');files=$inventory[$group].Count;sha256=(Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash.ToLowerInvariant()}
  }
  $record=@{format='ER-newsletter-backup-v1';createdAtUTC=[DateTime]::UtcNow.ToString('o');categories=$manifest;evidenceCompleteness='operator_review_required';automaticBrevoImport=$false}
  [IO.File]::WriteAllText((Join-Path $outputResolved 'manifest.json'),($record|ConvertTo-Json -Depth 8),[Text.UTF8Encoding]::new($false))
  Write-Output 'Three separate encrypted categories saved. Keep the passphrase separately; review evidence completeness before removing temporary exports.'
 }else{
  if((Get-Item -LiteralPath $inputResolved).Length -gt 150000000){throw 'Archive is too large.'}
  $e=[IO.File]::ReadAllText($inputResolved)|ConvertFrom-Json
  if($e.version -ne 1 -or $e.algorithm -ne 'AES-256-GCM' -or $e.kdf -ne 'PBKDF2-SHA256' -or $e.iterations -ne 600000 -or $e.category -notin @('contacts','doi','dezabonari')){throw 'Unsupported archive format.'}
  $salt=[Convert]::FromBase64String($e.salt);$nonce=[Convert]::FromBase64String($e.nonce);$tag=[Convert]::FromBase64String($e.tag);$cipher=[Convert]::FromBase64String($e.ciphertext)
  if($salt.Length -ne 16 -or $nonce.Length -ne 12 -or $tag.Length -ne 16){throw 'Invalid archive.'}
  $plain=[byte[]]::new($cipher.Length);$key=[Security.Cryptography.Rfc2898DeriveBytes]::Pbkdf2($passwordBytes,$salt,600000,[Security.Cryptography.HashAlgorithmName]::SHA256,32);$aes=[Security.Cryptography.AesGcm]::new($key,16)
  try{$aes.Decrypt($nonce,$cipher,$tag,$plain,[Text.Encoding]::UTF8.GetBytes('ER-newsletter-backup-v1:'+$e.category))}catch{throw 'Authentication failed: wrong passphrase or modified archive; no files restored.'}finally{$aes.Dispose();[Array]::Clear($key)}
  $memory=[IO.MemoryStream]::new($plain,$false);$zip=[IO.Compression.ZipArchive]::new($memory,[IO.Compression.ZipArchiveMode]::Read)
  try{
   foreach($entry in $zip.Entries){
    if($entry.FullName.Contains(':') -or [IO.Path]::IsPathRooted($entry.FullName)){throw 'Unsafe archive entry.'}
    $target=[IO.Path]::GetFullPath((Join-Path $outputResolved $entry.FullName))
    if(-not $target.StartsWith($outputResolved+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Unsafe archive path.'}
   }
   $null=[IO.Directory]::CreateDirectory($outputResolved)
   foreach($entry in $zip.Entries){
    $target=[IO.Path]::GetFullPath((Join-Path $outputResolved $entry.FullName));$null=[IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($target))
    $dest=[IO.File]::Open($target,[IO.FileMode]::CreateNew);$source=$entry.Open();try{$source.CopyTo($dest)}finally{$source.Dispose();$dest.Dispose()}
   }
  }finally{$zip.Dispose();$memory.Dispose();[Array]::Clear($plain)}
  Write-Output 'Decrypted into private quarantine only. No contacts imported or resubscribed.'
 }
}finally{[Array]::Clear($passwordBytes)}
