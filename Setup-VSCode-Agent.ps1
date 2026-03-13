<#
.SYNOPSIS
    Setup-VSCode-Agent.ps1 — v4.2

.DESCRIPTION
    HOST       : Windows 11 Pro x64 (ASUS TUF Gaming F15)
    HARDWARE   : NVIDIA GTX 1660 Ti/1650 — 6GB VRAM | 32GB RAM
    SEED (SPD) : E:\ — USB Ventoy (physical, NO SSH)
    REPO       : https://github.com/gauchersimon-cmd/AGI-OS-DAO-Futuristic
    STACK      : Next.js (TypeScript) + Litestar (Python) + Docker + pnpm
    VENTOY     : E:\Windows\ + E:\Linux Distros\
    REF        : plan_windows_agentique_final.md v4.2

    Prepares Windows 11 Pro x64 host machine, configures VS Code,
    installs all agentic dependencies, and clones the AGI-OS-DAO-Futuristic
    repo from GitHub. The Seed USB (E:) is connected via USB — NOT SSH.

.PARAMETER DriveLetter
    Default: E — Seed USB Ventoy drive letter

.PARAMETER UsePortablePaths
    Store VS Code user-data + extensions on E:\ (portable mode)

.EXAMPLE
    .\Setup-VSCode-Agent.ps1
    .\Setup-VSCode-Agent.ps1 -UsePortablePaths
    .\Setup-VSCode-Agent.ps1 -DriveLetter "F"
#>

param(
    [string]$DriveLetter   = "E",
    [switch]$UsePortablePaths
)

# ── CONSTANTS ──────────────────────────────────────────────────────────────────
$GITHUB_REPO    = "https://github.com/gauchersimon-cmd/AGI-OS-DAO-Futuristic"
$REPO_NAME      = "AGI-OS-DAO-Futuristic"
$DRIVE          = "${DriveLetter}:"
$WORKSPACE      = "$DRIVE\VSCode-Workspace"
$VSCODE_DATA    = "$DRIVE\VSCode-Data"
$VENTOY_WIN     = "$DRIVE\Windows"
$VENTOY_LINUX   = "$DRIVE\Linux Distros"
$CLONE_DEST     = "$WORKSPACE\projects\$REPO_NAME"
$AUDIT_LOG      = "$WORKSPACE\logs\hardware-audit.log"
$ENV_FILE       = "$CLONE_DEST\.env"

# ── HEADER ─────────────────────────────────────────────────────────────────────
Clear-Host
Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║  Setup-VSCode-Agent.ps1 — v4.2 (plan_windows_agentique_final)   ║" -ForegroundColor Magenta
Write-Host "║  HOST    : Windows 11 Pro x64 — ASUS TUF Gaming F15             ║" -ForegroundColor Cyan
Write-Host "║  GPU     : NVIDIA GTX 1660 Ti/1650 (6GB VRAM) | RAM: 32GB       ║" -ForegroundColor Cyan
Write-Host "║  SEED    : $DRIVE (USB Ventoy — physical, NO SSH)             ║" -ForegroundColor Cyan
Write-Host "║  REPO    : gauchersimon-cmd/AGI-OS-DAO-Futuristic                ║" -ForegroundColor Cyan
Write-Host "║  STACK   : Next.js + Litestar + Docker + pnpm + Ollama           ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# ── [1/14] WINGET ──────────────────────────────────────────────────────────────
Write-Host "[1/14] winget" -ForegroundColor Yellow
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "  ERROR: winget not found — https://aka.ms/winget-client" -ForegroundColor Red
    exit 1
}
Write-Host "  OK: winget $(winget --version)" -ForegroundColor Green

# ── [2/14] HARDWARE AUDIT (plan §5.1 Etape 3) ─────────────────────────────────
Write-Host "`n[2/14] Hardware audit — ASUS TUF Gaming F15" -ForegroundColor Yellow
New-Item -ItemType Directory -Path "$WORKSPACE\logs" -Force | Out-Null

$cpu      = (Get-CimInstance Win32_Processor).Name
$ramGB    = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 1)
$gpu      = (Get-CimInstance Win32_VideoController | Select-Object -First 1).Name
$winVer   = (Get-CimInstance Win32_OperatingSystem).Caption
$diskFree = [math]::Round((Get-PSDrive -Name $DriveLetter -ErrorAction SilentlyContinue).Free / 1GB, 1)

$auditContent = @"
HARDWARE AUDIT — $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
OS      : $winVer
CPU     : $cpu
RAM     : ${ramGB}GB
GPU     : $gpu
SEED    : $DRIVE — Free: ${diskFree}GB
"@

$auditContent | Set-Content -Path $AUDIT_LOG -Encoding UTF8
Write-Host "  OS   : $winVer" -ForegroundColor Gray
Write-Host "  CPU  : $cpu" -ForegroundColor Gray
Write-Host "  RAM  : ${ramGB}GB" -ForegroundColor Gray
Write-Host "  GPU  : $gpu" -ForegroundColor Gray
Write-Host "  SEED : $DRIVE — Free: ${diskFree}GB" -ForegroundColor Gray
Write-Host "  LOG  : $AUDIT_LOG" -ForegroundColor DarkGray
Write-Host "  OK" -ForegroundColor Green

# NVIDIA / CUDA check (plan §1.4)
Write-Host "`n  NVIDIA CUDA check..." -ForegroundColor DarkCyan
$nvidiaSmi = "C:\Windows\System32\nvidia-smi.exe"
if (Test-Path $nvidiaSmi) {
    $cudaInfo = & $nvidiaSmi --query-gpu=name,driver_version,memory.total --format=csv,noheader 2>&1
    Write-Host "  CUDA GPU: $cudaInfo" -ForegroundColor Cyan
    Add-Content -Path $AUDIT_LOG -Value "CUDA    : $cudaInfo"
} else {
    Write-Host "  WARNING: nvidia-smi not found — install CUDA drivers for GTX 1660 Ti/1650" -ForegroundColor DarkYellow
    Write-Host "  URL: https://www.nvidia.com/drivers" -ForegroundColor DarkYellow
    Add-Content -Path $AUDIT_LOG -Value "CUDA    : nvidia-smi NOT FOUND"
}

# ASUS TUF thermal/WMI check (plan §1.4)
Write-Host "`n  ASUS TUF WMI thermal check..." -ForegroundColor DarkCyan
try {
    $thermalMode = Get-WmiObject -Namespace "root\WMI" -Class "ASUS_WMI_Methodfunction" -ErrorAction Stop
    Write-Host "  ASUS WMI found — thermal profiles accessible." -ForegroundColor Cyan
    Add-Content -Path $AUDIT_LOG -Value "ASUS_WMI: FOUND"
} catch {
    Write-Host "  ASUS WMI not accessible — Armoury Crate optional." -ForegroundColor DarkGray
    Add-Content -Path $AUDIT_LOG -Value "ASUS_WMI: NOT ACCESSIBLE"
}

# ── [3/14] VS CODE ─────────────────────────────────────────────────────────────
Write-Host "`n[3/14] VS Code" -ForegroundColor Yellow
if (-not (Get-Command code -ErrorAction SilentlyContinue)) {
    Write-Host "  Installing Microsoft.VisualStudioCode..." -ForegroundColor Gray
    winget install --id Microsoft.VisualStudioCode -e --silent --accept-package-agreements --accept-source-agreements
    if ($LASTEXITCODE -ne 0) { Write-Host "  ERROR: VS Code install failed." -ForegroundColor Red; exit 1 }
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + $env:PATH
}
Write-Host "  OK: VS Code installed." -ForegroundColor Green

# ── [4/14] SEED DRIVE (E:\) ───────────────────────────────────────────────────
Write-Host "`n[4/14] Seed drive $DRIVE (Ventoy)" -ForegroundColor Yellow
if (-not (Test-Path $DRIVE)) {
    Write-Host "  ERROR: $DRIVE not found. Plug in USB Ventoy (Seed)." -ForegroundColor Red
    exit 1
}
foreach ($d in @($VENTOY_WIN, $VENTOY_LINUX)) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
        Write-Host "  MKDIR: $d" -ForegroundColor Gray
    } else {
        Write-Host "  EXISTS: $d" -ForegroundColor DarkGray
    }
}
Write-Host "  ISOs [$VENTOY_WIN]:" -ForegroundColor DarkCyan
Get-ChildItem "$VENTOY_WIN\*.iso" -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "    $($_.Name)" -ForegroundColor Gray }
Write-Host "  ISOs [$VENTOY_LINUX]:" -ForegroundColor DarkCyan
Get-ChildItem "$VENTOY_LINUX\*.iso" -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "    $($_.Name)" -ForegroundColor Gray }
Write-Host "  OK" -ForegroundColor Green

# ── [5/14] WORKSPACE STRUCTURE ────────────────────────────────────────────────
Write-Host "`n[5/14] Workspace structure on $DRIVE" -ForegroundColor Yellow
$dirs = @(
    $WORKSPACE,
    "$WORKSPACE\scripts",
    "$WORKSPACE\notes",
    "$WORKSPACE\projects",
    "$WORKSPACE\logs",
    "$WORKSPACE\os-configs\windows11",
    "$WORKSPACE\os-configs\fedora-desktop",
    "$WORKSPACE\os-configs\fedora-workstation",
    "$WORKSPACE\os-configs\blendos",
    "$WORKSPACE\agent\memory",
    "$WORKSPACE\agent\workflows",
    "$WORKSPACE\agent\secrets"
)
foreach ($d in $dirs) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
        Write-Host "  MKDIR: $d" -ForegroundColor Gray
    }
}
Write-Host "  OK" -ForegroundColor Green

# ── [6/14] GIT ────────────────────────────────────────────────────────────────
Write-Host "`n[6/14] Git" -ForegroundColor Yellow
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    winget install --id Git.Git -e --silent --accept-package-agreements --accept-source-agreements
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + $env:PATH
}
Write-Host "  OK: $(git --version)" -ForegroundColor Green

# ── [7/14] NODE.JS + PNPM ─────────────────────────────────────────────────────
Write-Host "`n[7/14] Node.js + pnpm (Next.js stack)" -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    winget install --id OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + $env:PATH
}
Write-Host "  OK: node $(node --version)" -ForegroundColor Green
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    npm install -g pnpm --silent
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + $env:PATH
}
Write-Host "  OK: pnpm $(pnpm --version)" -ForegroundColor Green

# ── [8/14] PYTHON 3.12 + AGENTIC DEPS (plan §5.1 Etape 5) ────────────────────
Write-Host "`n[8/14] Python 3.12 + agentic deps" -ForegroundColor Yellow
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    winget install --id Python.Python.3.12 -e --silent --accept-package-agreements --accept-source-agreements
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + $env:PATH
}
Write-Host "  OK: $(python --version)" -ForegroundColor Green
python -m pip install --upgrade pip --quiet

$pipDeps = @(
    "pyautogui",
    "opencv-python",
    "Pillow",
    "requests",
    "python-dotenv",
    "ollama",
    "openai",
    "anthropic",
    "google-generativeai",
    "paramiko",
    "litestar",
    "uvicorn",
    "sqlalchemy",
    "aiosqlite",
    "psutil",
    "pynvml"
)
foreach ($pkg in $pipDeps) {
    python -m pip install $pkg --quiet
    Write-Host "  INSTALLED: $pkg" -ForegroundColor DarkGray
}
$pipDeps | Set-Content -Path "$WORKSPACE\agent\requirements.txt" -Encoding UTF8
Write-Host "  WRITE: $WORKSPACE\agent\requirements.txt" -ForegroundColor DarkGray
Write-Host "  OK" -ForegroundColor Green

# ── [9/14] DOCKER DESKTOP ─────────────────────────────────────────────────────
Write-Host "`n[9/14] Docker Desktop" -ForegroundColor Yellow
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    winget install --id Docker.DockerDesktop -e --silent --accept-package-agreements --accept-source-agreements
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + $env:PATH
    Write-Host "  NOTE: Restart required after Docker install (WSL2 backend)." -ForegroundColor DarkYellow
} else {
    Write-Host "  OK: Docker already installed." -ForegroundColor Green
}

# ── [10/14] WSL2 (plan §4.1) ──────────────────────────────────────────────────
Write-Host "`n[10/14] WSL2" -ForegroundColor Yellow
$wslStatus = wsl --status 2>&1
if ($wslStatus -match "Default Distribution") {
    Write-Host "  OK: WSL2 already configured." -ForegroundColor Green
} else {
    wsl --install --no-distribution 2>&1 | Out-Null
    Write-Host "  NOTE: Restart may be required to complete WSL2 install." -ForegroundColor DarkYellow
}

# ── [11/14] OLLAMA (plan §5.1 Etape 7 — GTX 1660 Ti CUDA 4-bit) ──────────────
Write-Host "`n[11/14] Ollama (local LLM — CUDA GTX 1660 Ti/1650 — 4-bit q4_K_M)" -ForegroundColor Yellow
if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
    winget install --id Ollama.Ollama -e --silent --accept-package-agreements --accept-source-agreements
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + $env:PATH
} else {
    Write-Host "  OK: Ollama already installed." -ForegroundColor Green
}
Write-Host "  Pull llama3.2:3b-instruct-q4_K_M (4-bit — safe for 6GB VRAM)..." -ForegroundColor Gray
Start-Process -FilePath "ollama" -ArgumentList "pull llama3.2:3b-instruct-q4_K_M" -NoNewWindow -Wait -ErrorAction SilentlyContinue
Write-Host "  OK" -ForegroundColor Green

# ── [12/14] VS CODE EXTENSIONS ────────────────────────────────────────────────
Write-Host "`n[12/14] VS Code extensions" -ForegroundColor Yellow
$extensions = @(
    "ms-python.python",
    "ms-python.pylint",
    "charliermarsh.ruff",
    "ms-vscode.powershell",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "ms-azuretools.vscode-docker",
    "ms-vscode-remote.remote-wsl",
    "mhutchie.git-graph",
    "eamodio.gitlens",
    "continue.continue",
    "gruntfuggly.todo-tree",
    "yzhang.markdown-all-in-one",
    "ms-vscode.hexeditor",
    "ms-vscode.live-server",
    "humao.rest-client",
    "redhat.vscode-yaml",
    "mikestead.dotenv"
)
foreach ($ext in $extensions) {
    code --install-extension $ext --force 2>&1 | Out-Null
    Write-Host "  INSTALLED: $ext" -ForegroundColor DarkGray
}
Write-Host "  OK" -ForegroundColor Green

# ── [13/14] SETTINGS.JSON + .ENV TEMPLATE ─────────────────────────────────────
Write-Host "`n[13/14] settings.json + .env template" -ForegroundColor Yellow

$settingsDir  = Join-Path $env:APPDATA "Code\User"
New-Item -ItemType Directory -Path $settingsDir -Force | Out-Null
$settingsPath = Join-Path $settingsDir "settings.json"

$settings = [ordered]@{
    "security.workspace.trust.enabled"             = $true
    "security.workspace.trust.startupPrompt"       = "once"
    "files.autoSave"                               = "afterDelay"
    "files.autoSaveDelay"                          = 1000
    "terminal.integrated.defaultProfile.windows"  = "PowerShell"
    "workbench.startupEditor"                      = "none"
    "update.mode"                                  = "manual"
    "editor.formatOnSave"                          = $true
    "editor.defaultFormatter"                      = "esbenp.prettier-vscode"
    "editor.tabSize"                               = 2
    "editor.wordWrap"                              = "on"
    "git.autofetch"                                = $true
    "git.confirmSync"                              = $false
    "python.defaultInterpreterPath"                = "python"
    "typescript.preferences.importModuleSpecifier" = "relative"
    "tailwindCSS.includeLanguages"                 = @{ "typescript" = "html"; "typescriptreact" = "html" }
    "remote.SSH.showLoginTerminal"                 = $false
    "files.watcherExclude" = [ordered]@{
        "**/*.iso"            = $true
        "**/*.wim"            = $true
        "**/*.img"            = $true
        "**/*.vhd"            = $true
        "**/*.vhdx"           = $true
        "**/node_modules/**"  = $true
        "**/.next/**"         = $true
        "**/__pycache__/**"   = $true
        "**/.venv/**"         = $true
        "**/ollama/models/**" = $true
    }
    "files.exclude" = [ordered]@{
        "**/__pycache__" = $true
        "**/.next"       = $true
        "**/.venv"       = $true
    }
    "search.exclude" = [ordered]@{
        "**/node_modules"    = $true
        "**/.next"           = $true
        "**/.venv"           = $true
        "**/pnpm-lock.yaml"  = $true
        "**/ollama/models"   = $true
    }
}
$settings | ConvertTo-Json -Depth 6 | Set-Content -Path $settingsPath -Encoding UTF8
Write-Host "  WRITE: $settingsPath" -ForegroundColor DarkGray

# .env template — NEVER commit (plan §5.2 + §6.1)
$envTemplate = @"
# AGI-OS-DAO-Futuristic — .env
# plan_windows_agentique_final.md §5.2 §6.1
# WARNING: NEVER commit this file. Already in .gitignore.

# ── LLM APIs ──────────────────────────────────────────────────────────────────
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
XAI_API_KEY=

# ── Local LLM — Ollama (GTX 1660 Ti/1650 CUDA) ───────────────────────────────
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b-instruct-q4_K_M

# ── NVIDIA (plan §1.4) ────────────────────────────────────────────────────────
CUDA_VISIBLE_DEVICES=0
GPU_VRAM_LIMIT_GB=6

# ── Seed / SPD ────────────────────────────────────────────────────────────────
SEED_DRIVE=E:
SEED_WORKSPACE=E:\VSCode-Workspace

# ── Agent (plan §4.2) ─────────────────────────────────────────────────────────
AGENT_MODE=assistance
AGENT_LOG_LEVEL=INFO
AGENT_MEMORY_PATH=E:\VSCode-Workspace\agent\memory

# ── Next.js ───────────────────────────────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:8000

# ── Litestar backend ──────────────────────────────────────────────────────────
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
"@

if (-not (Test-Path (Split-Path $ENV_FILE))) {
    New-Item -ItemType Directory -Path (Split-Path $ENV_FILE) -Force | Out-Null
}
if (-not (Test-Path $ENV_FILE)) {
    $envTemplate | Set-Content -Path $ENV_FILE -Encoding UTF8
    Write-Host "  WRITE: $ENV_FILE" -ForegroundColor DarkGray
} else {
    Write-Host "  EXISTS (kept): $ENV_FILE" -ForegroundColor DarkGray
}

# Ensure .env in .gitignore
$gitignorePath = "$CLONE_DEST\.gitignore"
if (Test-Path $gitignorePath) {
    $gi = Get-Content $gitignorePath -Raw
    if ($gi -notmatch "^\.env$") {
        Add-Content -Path $gitignorePath -Value "`n.env" -Encoding UTF8
        Write-Host "  .env appended to .gitignore" -ForegroundColor DarkGray
    }
}
Write-Host "  OK" -ForegroundColor Green

# ── [14/14] CLONE + DEPS + WORKSPACE + OPEN ───────────────────────────────────
Write-Host "`n[14/14] git clone $GITHUB_REPO" -ForegroundColor Yellow
if (Test-Path "$CLONE_DEST\.git") {
    Write-Host "  PULL (already cloned)..." -ForegroundColor Gray
    Push-Location $CLONE_DEST
    git pull origin main
    Pop-Location
} else {
    Write-Host "  CLONE -> $CLONE_DEST" -ForegroundColor Gray
    git clone $GITHUB_REPO $CLONE_DEST
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ERROR: git clone failed. Verify GitHub auth in VS Code." -ForegroundColor Red
        exit 1
    }
}
Write-Host "  OK: $CLONE_DEST" -ForegroundColor Green

Push-Location $CLONE_DEST

# Frontend (pnpm)
Write-Host "  pnpm install..." -ForegroundColor Gray
pnpm install --frozen-lockfile 2>&1 | Out-Null
Write-Host "  OK: node_modules ready." -ForegroundColor Green

# Backend (Python / Litestar)
$backendPath = Join-Path $CLONE_DEST "backend"
if (Test-Path $backendPath) {
    $reqFile = Join-Path $backendPath "requirements.txt"
    if (Test-Path $reqFile) {
        Write-Host "  pip install -r backend/requirements.txt..." -ForegroundColor Gray
        python -m pip install -r $reqFile --quiet
    } else {
        Write-Host "  pip install litestar uvicorn..." -ForegroundColor Gray
        python -m pip install litestar uvicorn --quiet
    }
    Write-Host "  OK: Python backend deps." -ForegroundColor Green
}

Pop-Location

# Build .code-workspace
$workspaceFile = Join-Path $WORKSPACE "AGI-OS-DAO.code-workspace"
$wsObj = [ordered]@{
    folders = @(
        @{ path = $CLONE_DEST;                                name = "AGI-OS-DAO-Futuristic" },
        @{ path = "$CLONE_DEST\app";                          name = "Next.js — app/" },
        @{ path = "$CLONE_DEST\backend";                      name = "Litestar — backend/" },
        @{ path = "$CLONE_DEST\components";                   name = "Components" },
        @{ path = "$WORKSPACE\agent\workflows";               name = "Agent — Workflows" },
        @{ path = "$WORKSPACE\agent\memory";                  name = "Agent — Memory" },
        @{ path = "$WORKSPACE\scripts";                       name = "Scripts" },
        @{ path = "$WORKSPACE\notes";                         name = "Notes" },
        @{ path = "$WORKSPACE\os-configs\windows11";          name = "Config — Windows 11 Pro x64" },
        @{ path = "$WORKSPACE\os-configs\fedora-desktop";     name = "Config — Fedora Desktop" },
        @{ path = "$WORKSPACE\os-configs\fedora-workstation"; name = "Config — Fedora Workstation" },
        @{ path = "$WORKSPACE\os-configs\blendos";            name = "Config — BlendOS" },
        @{ path = $VENTOY_WIN;                                name = "[Ventoy] Windows ISOs" },
        @{ path = $VENTOY_LINUX;                              name = "[Ventoy] Linux Distros ISOs" }
    )
    settings = [ordered]@{
        "files.exclude" = [ordered]@{
            "**\*.iso"  = $true
            "**\*.wim"  = $true
            "**\*.img"  = $true
            "**\*.vhd"  = $true
            "**\*.vhdx" = $true
        }
        "search.exclude" = [ordered]@{
            "**\*.iso"  = $true
            "**\*.wim"  = $true
        }
    }
}
$wsObj | ConvertTo-Json -Depth 10 | Set-Content -Path $workspaceFile -Encoding UTF8
Write-Host "  WRITE: $workspaceFile" -ForegroundColor DarkGray

# Portable mode (optional)
if ($UsePortablePaths) {
    $userDataDir   = Join-Path $VSCODE_DATA "user-data"
    $extensionsDir = Join-Path $VSCODE_DATA "extensions"
    New-Item -ItemType Directory -Path $userDataDir   -Force | Out-Null
    New-Item -ItemType Directory -Path $extensionsDir -Force | Out-Null
    $launcherPath = Join-Path $WORKSPACE "Launch-VSCode.cmd"
    @"
@echo off
code --user-data-dir "$userDataDir" --extensions-dir "$extensionsDir" "$workspaceFile"
"@ | Set-Content -Path $launcherPath -Encoding ASCII
    Write-Host "  PORTABLE LAUNCHER: $launcherPath" -ForegroundColor DarkGray
}

# Open VS Code
Write-Host "`n  code `"$workspaceFile`"" -ForegroundColor White
code $workspaceFile

# ── SUMMARY ────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║  DONE — AGI-OS-DAO-Futuristic bootstrap complete                ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""
Write-Host "  SEED       : $DRIVE (Ventoy)" -ForegroundColor Cyan
Write-Host "  REPO       : $CLONE_DEST" -ForegroundColor Cyan
Write-Host "  FRONTEND   : $CLONE_DEST\app  ->  pnpm dev" -ForegroundColor Cyan
Write-Host "  BACKEND    : $CLONE_DEST\backend  ->  uvicorn main:app --reload" -ForegroundColor Cyan
Write-Host "  DOCKER     : $CLONE_DEST\docker-compose.yml  ->  docker-compose up" -ForegroundColor Cyan
Write-Host "  OLLAMA     : ollama run llama3.2:3b-instruct-q4_K_M" -ForegroundColor Cyan
Write-Host "  ENV        : $ENV_FILE  (fill API keys — NOT committed)" -ForegroundColor Cyan
Write-Host "  AUDIT LOG  : $AUDIT_LOG" -ForegroundColor Cyan
Write-Host ""
Write-Host "  NEXT STEPS:" -ForegroundColor Yellow
Write-Host "    1. Fill $ENV_FILE with your API keys" -ForegroundColor White
Write-Host "    2. cd $CLONE_DEST" -ForegroundColor White
Write-Host "    3. pnpm dev                           # Next.js frontend" -ForegroundColor White
Write-Host "    4. cd backend && uvicorn main:app --reload  # Litestar API" -ForegroundColor White
Write-Host "    5. docker-compose up                  # Full stack" -ForegroundColor White
Write-Host "    6. ollama serve                       # Local LLM (CUDA GTX 1660 Ti)" -ForegroundColor White
Write-Host ""
Write-Host "  VENTOY on $DRIVE:" -ForegroundColor Yellow
Write-Host "    $VENTOY_WIN\       -> Windows 11 Pro x64 ISO" -ForegroundColor White
Write-Host "    $VENTOY_LINUX\  -> Fedora Desktop, Workstation, BlendOS ISO" -ForegroundColor White
Write-Host ""
