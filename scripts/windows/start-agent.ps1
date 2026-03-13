<#
.SYNOPSIS
    start-agent.ps1 — Demarre la stack complete AGI-OS-DAO
    Frontend (Next.js) + Backend (Litestar) + Ollama (LLM local)
    Lit les cles API depuis les VARIABLES D'ENVIRONNEMENT SYSTEME.

.USAGE
    PowerShell (Admin recommande) :
    .\scripts\windows\start-agent.ps1

    Options:
    .\scripts\windows\start-agent.ps1 -Frontend
    .\scripts\windows\start-agent.ps1 -Backend
    .\scripts\windows\start-agent.ps1 -Ollama
    .\scripts\windows\start-agent.ps1 -All
#>

param(
    [switch]$Frontend,
    [switch]$Backend,
    [switch]$Ollama,
    [switch]$All
)

$REPO = "E:\VSCode-Workspace\projects\AGI-OS-DAO-Futuristic"

# Si aucun flag -> lance tout
if (-not $Frontend -and -not $Backend -and -not $Ollama) { $All = $true }

Write-Host ""
Write-Host "  AGI-OS-DAO — Stack Launcher" -ForegroundColor Magenta
Write-Host "  ============================" -ForegroundColor Magenta
Write-Host ""

# ── INJECTER LES VARS D'ENV SYSTEME DANS LA SESSION COURANTE ──────────────────
Write-Host "  [ENV] Injection variables systeme dans la session..." -ForegroundColor Yellow

$envVarNames = @(
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
    "GOOGLE_API_KEY",
    "XAI_API_KEY",
    "OLLAMA_HOST",
    "OLLAMA_MODEL",
    "CUDA_VISIBLE_DEVICES",
    "GPU_VRAM_LIMIT_GB",
    "NEXT_PUBLIC_API_URL",
    "BACKEND_HOST",
    "BACKEND_PORT"
)

foreach ($name in $envVarNames) {
    $val = [System.Environment]::GetEnvironmentVariable($name, "Machine")
    if (-not $val) { $val = [System.Environment]::GetEnvironmentVariable($name, "User") }
    if ($val) {
        [System.Environment]::SetEnvironmentVariable($name, $val, "Process")
        $masked = if ($name -like "*KEY*") { $val.Substring(0, [Math]::Min(8,$val.Length)) + "****" } else { $val }
        Write-Host "    SET $name = $masked" -ForegroundColor DarkGray
    }
}

# Defaults si manquants
if (-not $env:OLLAMA_HOST)          { $env:OLLAMA_HOST = "http://localhost:11434" }
if (-not $env:OLLAMA_MODEL)         { $env:OLLAMA_MODEL = "llama3.2:3b-instruct-q4_K_M" }
if (-not $env:NEXT_PUBLIC_API_URL)  { $env:NEXT_PUBLIC_API_URL = "http://localhost:8000" }
if (-not $env:BACKEND_PORT)         { $env:BACKEND_PORT = "8000" }
if (-not $env:CUDA_VISIBLE_DEVICES) { $env:CUDA_VISIBLE_DEVICES = "0" }

Write-Host "  OK" -ForegroundColor Green
Write-Host ""

# ── VERIF REPO ──────────────────────────────────────────────────────────────
if (-not (Test-Path $REPO)) {
    Write-Host "  ERROR: Repo non trouve: $REPO" -ForegroundColor Red
    Write-Host "  Lance d'abord Setup-VSCode-Agent.ps1" -ForegroundColor DarkYellow
    exit 1
}

# ── OLLAMA ──────────────────────────────────────────────────────────────────
if ($All -or $Ollama) {
    Write-Host "  [OLLAMA] Demarrage LLM local (GTX 1660 Ti CUDA)..." -ForegroundColor Yellow
    $ollamaRunning = try { (Invoke-WebRequest "$env:OLLAMA_HOST" -TimeoutSec 2 -UseBasicParsing).StatusCode -eq 200 } catch { $false }
    if ($ollamaRunning) {
        Write-Host "  Ollama deja actif sur $env:OLLAMA_HOST" -ForegroundColor DarkGray
    } else {
        Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Minimized
        Start-Sleep -Seconds 2
        Write-Host "  Ollama demarre. Modele: $env:OLLAMA_MODEL" -ForegroundColor Green
    }
    Write-Host ""
}

# ── BACKEND (Litestar) ─────────────────────────────────────────────────────
if ($All -or $Backend) {
    $backendPath = Join-Path $REPO "backend"
    if (Test-Path $backendPath) {
        Write-Host "  [BACKEND] Litestar — port $env:BACKEND_PORT" -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "
            Set-Location '$backendPath'
            Write-Host '  Backend Litestar — http://localhost:$env:BACKEND_PORT' -ForegroundColor Cyan
            uvicorn main:app --host $env:BACKEND_HOST --port $env:BACKEND_PORT --reload
        " -WindowStyle Normal
        Write-Host "  Backend en cours dans nouvelle fenetre." -ForegroundColor Green
    } else {
        Write-Host "  SKIP: backend/ non trouve dans le repo." -ForegroundColor DarkGray
    }
    Write-Host ""
}

# ── FRONTEND (Next.js) ────────────────────────────────────────────────────
if ($All -or $Frontend) {
    Write-Host "  [FRONTEND] Next.js — port 3000" -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "
        Set-Location '$REPO'
        Write-Host '  Next.js — http://localhost:3000' -ForegroundColor Cyan
        pnpm dev
    " -WindowStyle Normal
    Write-Host "  Frontend en cours dans nouvelle fenetre." -ForegroundColor Green
    Write-Host ""
}

Write-Host "  STACK ACTIVE:" -ForegroundColor Magenta
if ($All -or $Ollama)   { Write-Host "    Ollama LLM : $env:OLLAMA_HOST  (model: $env:OLLAMA_MODEL)" -ForegroundColor Cyan }
if ($All -or $Backend)  { Write-Host "    Backend    : http://localhost:$env:BACKEND_PORT" -ForegroundColor Cyan }
if ($All -or $Frontend) { Write-Host "    Frontend   : http://localhost:3000" -ForegroundColor Cyan }
Write-Host ""
