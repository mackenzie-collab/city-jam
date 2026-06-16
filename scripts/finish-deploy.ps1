# Finish City Jam deploy - run after `vercel login`
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

Write-Host ""
Write-Host "=== City Jam - finish Vercel deploy ===" -ForegroundColor Cyan
Write-Host ""

if (!(Test-Path ".env.local")) {
  Write-Host "Missing .env.local - Supabase keys not found." -ForegroundColor Red
  exit 1
}

$envVars = @{}
Get-Content ".env.local" | ForEach-Object {
  if ($_ -match '^([^#=]+)=(.*)$') {
    $envVars[$matches[1].Trim()] = $matches[2].Trim()
  }
}

$url = $envVars["NEXT_PUBLIC_SUPABASE_URL"]
$key = $envVars["NEXT_PUBLIC_SUPABASE_ANON_KEY"]

if (!$url -or !$key) {
  Write-Host "Missing Supabase vars in .env.local" -ForegroundColor Red
  exit 1
}

Write-Host "Linking Vercel project..." -ForegroundColor Yellow
vercel link --yes 2>$null

Write-Host "Setting Vercel environment variables..." -ForegroundColor Yellow
foreach ($envName in @("production", "preview", "development")) {
  if ($envName -eq "preview") {
    $url | vercel env add NEXT_PUBLIC_SUPABASE_URL preview --value $url --yes 2>$null
    $key | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview --value $key --yes 2>$null
  } else {
    $url | vercel env add NEXT_PUBLIC_SUPABASE_URL $envName --yes 2>$null
    $key | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY $envName --yes 2>$null
  }
}

Write-Host "Deploying to production..." -ForegroundColor Yellow
vercel --prod --yes

Write-Host ""
Write-Host "Done! Test /api/health on the URL above." -ForegroundColor Green
Write-Host ""
