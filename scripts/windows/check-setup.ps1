<#
.SYNOPSIS
    check-setup.ps1 — Vérifie l'architecture REX + Bureau + GitHub
    Lance ce script pour savoir exactement où tu en es.
#>

$GITHUB_URL  = "https://github.com/gauchersimon-cmd/AGI-OS-DAO-Futuristic.git"
$BUREAU_PATH = "C:\Users\rhyme\Desktop\AGI-OS-DAO-Futuristic"

# Cherche REX automatiquement sur tous les drives
$REX_PATH = $null
$drives = Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Name -ne "C" }
foreach ($d in $drives) {
    $candidate = "$($d.Root)AGI-OS-DAO-Futuristic"
    if (Test-Path $candidate) {
        $REX_PATH = $candidate
        break
    }
}

function Write-OK   { param($msg) Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-WARN { param($msg) Write-Host "  [!!] $msg" -ForegroundColor Yellow }
function Write-FAIL { param($msg) Write-Host "  [XX] $msg" -ForegroundColor Red }
function Write-INFO { param($msg) Write-Host "  [--] $msg" -ForegroundColor Cyan }

function Test-GitRepo($path) {
    return (Test-Path "$path\.git") -or ((git -C $path rev-parse --git-dir 2>$null) -ne $null)
}

function Get-LastCommit($path) {
    try {
        $sha = git -C $path rev-parse --short HEAD 2>$null
        $msg = git -C $path log -1 --pretty=%s 2>$null
        return "$sha — $msg"
    } catch { return "inconnu" }
}

function Get-DrivesInfo {
    Get-PSDrive -PSProvider FileSystem | ForEach-Object {
        $used = if ($_.Used) { [math]::Round($_.Used/1GB, 1) } else { "?" }
        $free = if ($_.Free) { [math]::Round($_.Free/1GB, 1) } else { "?" }
        Write-INFO "Drive $($_.Name): \ — Utilisé: ${used}GB  Libre: ${free}GB"
    }
}

Clear-Host
Write-Host ""
Write-Host "  ==========================================" -ForegroundColor Magenta
Write-Host "   AGI-OS-DAO — CHECK SETUP" -ForegroundColor Magenta  
Write-Host "  ==========================================" -ForegroundColor Magenta
Write-Host ""

# ── DRIVES DISPONIBLES ─────────────────────────────────────────────────────
Write-Host "  DRIVES DETECTES" -ForegroundColor Yellow
Get-DrivesInfo
Write-Host ""

# ── 1. REX (Seed) ────────────────────────────────────────────────────────────
Write-Host "  1. REX (Seed USB — original permanent)" -ForegroundColor Yellow
if ($REX_PATH) {
    Write-OK  "Trouvé : $REX_PATH"
    if (Test-GitRepo $REX_PATH) {
        Write-OK  "Repo Git validé"
        Write-INFO "Dernier commit : $(Get-LastCommit $REX_PATH)"
        $remote = git -C $REX_PATH remote get-url origin 2>$null
        if ($remote -like "*gauchersimon-cmd*") {
            Write-OK  "Remote GitHub correct : $remote"
        } else {
            Write-WARN "Remote inattendu : $remote"
            Write-INFO "Fix: git -C `"$REX_PATH`" remote set-url origin $GITHUB_URL"
        }
    } else {
        Write-WARN "Dossier existe MAIS pas un repo Git"
        Write-INFO "Fix: git -C `"$REX_PATH`" init"
        Write-INFO "     git -C `"$REX_PATH`" remote add origin $GITHUB_URL"
        Write-INFO "     git -C `"$REX_PATH`" pull origin main"
    }
} else {
    Write-FAIL "REX INTROUVABLE sur aucun drive externe"
    Write-INFO "Drives disponibles (voir ci-dessus)"
    Write-INFO "Crée le dossier sur ta Seed puis:"
    Write-INFO "  git clone $GITHUB_URL E:\AGI-OS-DAO-Futuristic"
}
Write-Host ""

# ── 2. BUREAU (Windows éphémère) ─────────────────────────────────────────────
Write-Host "  2. BUREAU (Windows éphémère — copie de travail)" -ForegroundColor Yellow
if (Test-Path $BUREAU_PATH) {
    Write-OK  "Trouvé : $BUREAU_PATH"
    if (Test-GitRepo $BUREAU_PATH) {
        Write-OK  "Repo Git validé"
        Write-INFO "Dernier commit : $(Get-LastCommit $BUREAU_PATH)"
        $remote = git -C $BUREAU_PATH remote get-url origin 2>$null
        if ($remote -like "*gauchersimon-cmd*") {
            Write-OK  "Remote GitHub correct : $remote"
        } else {
            Write-WARN "Remote inattendu : $remote"
        }
        # Vérif sync
        git -C $BUREAU_PATH fetch origin 2>$null
        $ahead  = (git -C $BUREAU_PATH rev-list origin/main..HEAD --count 2>$null)
        $behind = (git -C $BUREAU_PATH rev-list HEAD..origin/main --count 2>$null)
        if ($ahead -gt 0)  { Write-WARN "$ahead commit(s) locaux non pushés" }
        if ($behind -gt 0) { Write-WARN "$behind commit(s) GitHub non pullés" }
        if ($ahead -eq 0 -and $behind -eq 0) { Write-OK "Synchro avec GitHub parfaite" }
    } else {
        Write-WARN "Dossier existe MAIS pas un repo Git (ZIP extrait?)"
        Write-INFO "Fix: cd \"$BUREAU_PATH\" puis git init + git remote add origin + git pull"
        Write-INFO "Ou mieux — supprime et reclone:"
        Write-INFO "  Remove-Item -Recurse -Force `"$BUREAU_PATH`""
        Write-INFO "  git clone $GITHUB_URL `"$BUREAU_PATH`""
    }
} else {
    Write-FAIL "BUREAU INTROUVABLE : $BUREAU_PATH"
    Write-INFO "Fix: git clone $GITHUB_URL `"$BUREAU_PATH`""
}
Write-Host ""

# ── 3. GITHUB (cloud) ────────────────────────────────────────────────────────────
Write-Host "  3. GITHUB (cloud backup)" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "https://api.github.com/repos/gauchersimon-cmd/AGI-OS-DAO-Futuristic" -TimeoutSec 5
    Write-OK  "Repository accessible : $($resp.full_name)"
    Write-INFO "Dernière mise à jour : $($resp.updated_at)"
    Write-INFO "Branche par défaut  : $($resp.default_branch)"
    Write-INFO "URL                 : $($resp.html_url)"
} catch {
    Write-FAIL "GitHub inaccessible (pas d'internet ou repo privé?)"
}
Write-Host ""

# ── RÉSUMÉ ──────────────────────────────────────────────────────────────────
Write-Host "  ==========================================" -ForegroundColor Magenta
Write-Host "   ARCHITECTURE CIBLE" -ForegroundColor Magenta
Write-Host "  ==========================================" -ForegroundColor Magenta
Write-Host "  REX (Seed)  →  base permanente, survit à Windows reinstall" -ForegroundColor Cyan
Write-Host "  GitHub      →  miroir cloud, toujours à jour" -ForegroundColor Cyan  
Write-Host "  Bureau      →  copie éphémère Windows, rechargeable en 1 cmd" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Pour syncer tout: .\scripts\windows\rex-sync.ps1" -ForegroundColor DarkCyan
Write-Host "  Pour re-checker : .\scripts\windows\check-setup.ps1" -ForegroundColor DarkCyan
Write-Host ""
