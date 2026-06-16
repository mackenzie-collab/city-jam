# Finish City Jam deploy — run after `vercel login`
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "`n=== City Jam — finish Vercel deploy ===`n" -ForegroundColor Cyan

# 1. Local health check
Write-Host "Checking local Supabase..." -ForegroundColor Yellow
try {
  $health = Invoke-RestMethod "http://localhost:3000/api/health" -TimeoutSec 5
  if ($health.ok) {
    Write-Host "  Local Supabase: OK" -ForegroundColor Green
  } else {
    Write-Host "  Local health failed — run 'npm run dev' first" -ForegroundColor Red
  }
} catch {
  Write-Host "  Dev server not running. Start with: npm run dev" -ForegroundColor Red
}

# 2. Load .env.local
if (!(Test-Path ".env.local")) {
  Write-Host "`nMissing .env.local — Supabase keys not found." -ForegroundColor Red
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

Write-Host "`nVercel login required if not already logged in:" -ForegroundColor Yellow
Write-Host "  vercel login`n"

# 3. Link project (creates .vercel if needed)
Write-Host "Linking Vercel project (pick city-jam or create new)..." -ForegroundColor Yellow
vercel link --yes 2>$null

# 4. Push env vars (non-interactive)
Write-Host "Setting Vercel environment variables..." -ForegroundColor Yellow
echo $url | vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development --yes 2>$null
echo $key | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development --yes 2>$null

# 5. Deploy
Write-Host "`nDeploying to production..." -ForegroundColor Yellow
vercel --prod --yes

Write-Host "`nDone! Open the URL above and test /api/health" -ForegroundColor Green
Write-Host "Share that URL with friends for live matching.`n" -ForegroundColor Green
