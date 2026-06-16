# Push City Jam to GitHub (run once after: gh auth login)

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

Write-Host "Creating public repo city-jam and pushing..." -ForegroundColor Cyan

gh repo create city-jam --public --source=. --remote=origin --push --description "City Jam - audio-first musician studio and matchmaking"

Write-Host ""
Write-Host "Done! Your repo:" -ForegroundColor Green
gh repo view --json url -q .url
