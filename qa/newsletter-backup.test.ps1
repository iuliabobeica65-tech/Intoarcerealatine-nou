#requires -Version 7.4
$ErrorActionPreference='Stop'
$repo=Split-Path $PSScriptRoot -Parent
$run='synthetic-'+[Guid]::NewGuid().ToString('N')
$root=Join-Path $repo '.local/newsletter-private'
$incoming=Join-Path $root ('incoming/'+$run);$backup=Join-Path $root ('backups/'+$run)
foreach($group in @('contacts','doi','dezabonari')){
 $folder=Join-Path $incoming $group;$null=[IO.Directory]::CreateDirectory($folder)
 [IO.File]::WriteAllText((Join-Path $folder 'fixture.csv'),"email,type`nfixture@example.invalid,$group`n")
}
$password=ConvertTo-SecureString ([Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))) -AsPlainText -Force
& (Join-Path $repo 'scripts/newsletter-backup.ps1') -Action Protect -InputPath $incoming -OutputPath $backup -Password $password | Out-Null
foreach($group in @('contacts','doi','dezabonari')){
 $file=Join-Path $backup ($group+'.erbackup.json');$envelope=[IO.File]::ReadAllText($file)
 if($envelope.Contains('fixture@example.invalid')){throw 'Plain email in encrypted output.'}
 $restore=Join-Path $root ('quarantine/'+$run+'/'+$group)
 & (Join-Path $repo 'scripts/newsletter-backup.ps1') -Action Restore -InputPath $file -OutputPath $restore -Password $password | Out-Null
 if((Get-FileHash -LiteralPath (Join-Path $incoming ($group+'/fixture.csv'))).Hash -ne (Get-FileHash -LiteralPath (Join-Path $restore 'fixture.csv')).Hash){throw 'Round trip changed data.'}
}
$wrong=ConvertTo-SecureString 'synthetic-wrong-passphrase-only' -AsPlainText -Force
$rejected=$false;try{& (Join-Path $repo 'scripts/newsletter-backup.ps1') -Action Restore -InputPath (Join-Path $backup 'contacts.erbackup.json') -OutputPath (Join-Path $root ('quarantine/'+$run+'/wrong-password')) -Password $wrong | Out-Null}catch{$rejected=$_.Exception.Message -like 'Authentication failed*'}
if(-not $rejected){throw 'Wrong password not rejected.'}
$outsideRejected=$false;try{& (Join-Path $repo 'scripts/newsletter-backup.ps1') -Action Protect -InputPath $incoming -OutputPath (Join-Path $repo ('public-'+$run)) -Password $password | Out-Null}catch{$outsideRejected=$_.Exception.Message -like 'Path must be inside*'}
if(-not $outsideRejected){throw 'Public output path not rejected.'}
$overwriteRejected=$false;try{& (Join-Path $repo 'scripts/newsletter-backup.ps1') -Action Protect -InputPath $incoming -OutputPath $backup -Password $password | Out-Null}catch{$overwriteRejected=$_.Exception.Message -like 'Output already exists*'}
if(-not $overwriteRejected){throw 'Existing archive could be overwritten.'}
$result=@{syntheticOnly=$true;encryptedCategories=3;roundTripsVerified=3;plaintextEmailAbsent=$true;wrongPasswordRejected=$true;publicPathRejected=$true;overwriteRejected=$true;providerCalls=0;realEmails=0;oldTestsRepeated=$false}
$result|ConvertTo-Json|Set-Content (Join-Path $repo '.local/newsletter-collection-preview/monthly-backup-local-test.json') -Encoding utf8
$result|ConvertTo-Json
