#requires -Version 7.4
$ErrorActionPreference='Stop'
$repo=Split-Path $PSScriptRoot -Parent
$run=[Guid]::NewGuid().ToString('N')
$output=Join-Path $repo ('.local/newsletter-private/backups/short-password-'+$run)
$rejected=$false
try{& (Join-Path $repo 'scripts/newsletter-backup.ps1') -Action Protect -InputPath (Join-Path $repo '.local/newsletter-private/incoming/not-read') -OutputPath $output -Password (ConvertTo-SecureString 'short' -AsPlainText -Force)|Out-Null}catch{$rejected=$_.Exception.Message -like 'Use a long passphrase*'}
if(-not $rejected -or (Test-Path -LiteralPath $output)){throw 'Short passphrase must fail without writing files.'}
Write-Output 'New short-passphrase guard passed; previous crypto checks not repeated.'
