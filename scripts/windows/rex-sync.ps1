<#
.SYNOPSIS
    rex-sync.ps1 — Synchronisation REX (Seed E:\) <-> Bureau (C:\Desktop) <-> GitHub
    REX = copie originale sur Seed USB portable (E:\AGI-OS-DAO-Futuristic)
    Bureau = copie de travail Windows (C:\Users\rhyme\Desktop\AGI-OS-DAO-Futuristic)

.DESCRIPTION
    Maintient les 3 copies en sync permanent :
    1. REX (E:\) <-> GitHub (push/pull)
    2. Bureau (C:\Desktop) <-> GitHub (push/pull)
    3. Optionnel : REX -> Bureau (robocopy miroir local)

    Survie Windows reinstall : REX sur Seed est toujours l'original.
    Si Windows crash -> REX intact sur E:\ -> recloner sur nouveau Windows.

.USAGE
    .\scripts\windows\rex-sync.ps1                  # Sync complet
    .\scripts\windows\rex-sync.ps1 -From rex         # Push REX vers GitHub
    .\scripts\windows\rex-sync.ps1 -From bureau      # Push Bureau vers GitHub
    .\scripts\windows\rex-sync.ps1 -Pull             # Pull GitHub -> les deux copies
    .\scripts\windows\rex-sync.ps1 -Status           # Voir l'etat des 3 copies
    .\scripts\windows\rex-sync.ps1 -Watch            # Mode surveillance continue (auto-sync)
#>

param(
    [string]$From    = "auto",   # rex | bureau | auto
    [switch]$Pull,
    [switch]$Status,
    [switch]$Watch,
    [int]$WatchInterval = 120    # secondes entre chaque sync en mode Watch
)

# ── CHEMINS ───────────────────────────────────────────────────────────
$REX_PATH    = "E:\AGI-OS-DAO-Futuristic"
$BUREAU_PATH = "C:\Users\rhyme\Desktop\AGI-OS-DAO-Futuristic"
$GITHUB_URL  = "https://github.com/gauchersimon-cmd/AGI-OS-DAO-Futuristic.git"
$REPO_NAME   = "AGI-OS-DAO-Futuristic"

function Write-Header {
    Write-Host ""
    Write-Host "  AGI-OS-DAO — REX SYNC" -ForegroundColor Magenta
    Write-Host "  ======================" -ForegroundColor Magenta
    Write-Host "  REX    (Seed E:\) : $REX_PATH" -ForegroundColor Cyan
    Write-Host "  Bureau (Desktop)  : $BUREAU_PATH" -ForegroundColor Yellow
    Write-Host "  GitHub            : $GITHUB_URL" -ForegroundColor DarkCyan
    Write-Host ""
}

function Test-GitRepo($path) {
    return (Test-Path "$path\.git")
}

function Get-GitStatus($path, $label) {
    if (-not (Test-Path $path)) {
        Write-Host "  [$label] ABSENT : $path" -ForegroundColor Red
        return
    }
    if (-not (Test-GitRepo $path)) {
        Write-Host "  [$label] PRESENT mais pas un repo Git : $path" -ForegroundColor DarkYellow
        return
    }
    Push-Location $path
    $branch  = git rev-parse --abbrev-ref HEAD 2>$null
    $sha     = git rev-parse --short HEAD 2>$null
    $dirty   = git status --short 2>$null
    $ahead   = (git rev-list origin/main..HEAD --count 2>$null)
    $behind  = (git rev-list HEAD..origin/main --count 2>$null)
    Pop-Location

    $statusColor = if ($dirty) { "DarkYellow" } else { "Green" }
    Write-Host "  [$label] branch=$branch | sha=$sha | ahead=$ahead | behind=$behind" -ForegroundColor $statusColor
    if ($dirty) {
        Write-Host "    Fichiers modifies:" -ForegroundColor DarkYellow
        $dirty | ForEach-Object { Write-Host "      $_" -ForegroundColor DarkGray }
    }
}

function Invoke-GitSync($path, $label, $commitMsg) {
    if (-not (Test-Path $path)) {
        Write-Host "  [$label] Chemin introuvable: $path" -ForegroundColor Red
        return $false
    }
    if (-not (Test-GitRepo $path)) {
        Write-Host "  [$label] Pas un repo Git — clone en cours..." -ForegroundColor Yellow
        $parent = Split-Path $path -Parent
        Push-Location $parent
        git clone $GITHUB_URL
        Pop-Location
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  [$label] Erreur clone." -ForegroundColor Red
            return $false
        }
        Write-Host "  [$label] Clone OK." -ForegroundColor Green
    }

    Push-Location $path
    git fetch origin 2>$null

    # Stash si dirty
    $dirty = git status --short 2>$null
    if ($dirty) {
        Write-Host "  [$label] Changements detectes — commit auto..." -ForegroundColor Yellow
        git add -A
        $msg = if ($commitMsg) { $commitMsg } else { "chore($label): auto-sync $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }
        git commit -m $msg
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [$label] Commit OK." -ForegroundColor Green
        }
    }

    # Pull rebase
    git pull origin main --rebase 2>$null
    $pullStatus = $LASTEXITCODE

    # Push
    git push origin main 2>$null
    $pushStatus = $LASTEXITCODE

    Pop-Location

    if ($pushStatus -eq 0) {
        Write-Host "  [$label] SYNC OK → GitHub" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  [$label] Push partiel (voir git status)" -ForegroundColor DarkYellow
        return $false
    }
}

function Invoke-LocalMirror {
    # REX -> Bureau via robocopy (fichiers seulement, pas .git)
    if (-not (Test-Path $REX_PATH)) {
        Write-Host "  [MIRROR] REX absent, skip." -ForegroundColor DarkGray
        return
    }
    Write-Host "  [MIRROR] REX → Bureau (robocopy)..." -ForegroundColor Yellow
    robocopy $REX_PATH $BUREAU_PATH /MIR /XD ".git" "node_modules" ".next" /XF "*.log" /NJH /NJS /NFL /NDL | Out-Null
    Write-Host "  [MIRROR] OK" -ForegroundColor Green
}

function Show-RecoveryGuide {
    Write-Host ""
    Write-Host "  GUIDE DE SURVIE (si Windows se reinstalle)" -ForegroundColor DarkCyan
    Write-Host "  -------------------------------------------" -ForegroundColor DarkCyan
    Write-Host "  1. Booter sur Seed USB (E:\)" -ForegroundColor White
    Write-Host "  2. REX est intact sur E:\AGI-OS-DAO-Futuristic" -ForegroundColor White
    Write-Host "  3. Apres reinstall Windows, ouvrir PowerShell Admin :" -ForegroundColor White
    Write-Host "     cd E:\AGI-OS-DAO-Futuristic" -ForegroundColor Cyan
    Write-Host "     git pull origin main" -ForegroundColor Cyan
    Write-Host "     pnpm install" -ForegroundColor Cyan
    Write-Host "     .\scripts\windows\Setup-VSCode-Agent.ps1" -ForegroundColor Cyan
    Write-Host "  4. Ou cloner depuis GitHub sur nouveau Windows :" -ForegroundColor White
    Write-Host "     git clone $GITHUB_URL C:\Users\rhyme\Desktop\AGI-OS-DAO-Futuristic" -ForegroundColor Cyan
    Write-Host ""
}

# ── MAIN ─────────────────────────────────────────────────────────────────
Write-Header

if ($Status) {
    Write-Host "  STATUT DES COPIES" -ForegroundColor Yellow
    Get-GitStatus $REX_PATH    "REX   "
    Get-GitStatus $BUREAU_PATH "BUREAU"
    Write-Host ""
    Show-RecoveryGuide
    exit 0
}

if ($Pull) {
    Write-Host "  PULL GitHub → REX + Bureau" -ForegroundColor Yellow
    foreach ($p in @(@{P=$REX_PATH;L="REX"}, @{P=$BUREAU_PATH;L="BUREAU"})) {
        if (Test-GitRepo $p.P) {
            Push-Location $p.P
            git pull origin main
            Write-Host "  [$($p.L)] Pull OK" -ForegroundColor Green
            Pop-Location
        } else {
            Write-Host "  [$($p.L)] Pas un repo — clone..." -ForegroundColor Yellow
            $parent = Split-Path $p.P -Parent
            Push-Location $parent
            git clone $GITHUB_URL (Split-Path $p.P -Leaf)
            Pop-Location
        }
    }
    exit 0
}

if ($Watch) {
    Write-Host "  MODE WATCH actif (interval: ${WatchInterval}s) — Ctrl+C pour stopper" -ForegroundColor Magenta
    Write-Host ""
    while ($true) {
        $timestamp = Get-Date -Format 'HH:mm:ss'
        Write-Host "  [$timestamp] Sync..." -ForegroundColor DarkGray
        Invoke-GitSync $REX_PATH    "REX"
        Invoke-GitSync $BUREAU_PATH "BUREAU"
        Write-Host "  Prochain sync dans ${WatchInterval}s" -ForegroundColor DarkGray
        Start-Sleep -Seconds $WatchInterval
    }
    exit 0
}

# Sync selon -From
if ($From -eq "rex" -or $From -eq "auto") {
    Write-Host "  SYNC REX (Seed E:\) → GitHub" -ForegroundColor Yellow
    Invoke-GitSync $REX_PATH "REX"
    Write-Host ""
}

if ($From -eq "bureau" -or $From -eq "auto") {
    Write-Host "  SYNC Bureau (Desktop) → GitHub" -ForegroundColor Yellow
    Invoke-GitSync $BUREAU_PATH "BUREAU"
    Write-Host ""
}

Invoke-LocalMirror
Show-RecoveryGuide

Write-Host "  REX SYNC COMPLET." -ForegroundColor Magenta
Write-Host ""
