param(
    [switch]$RunSFC,
    [switch]$RunDISM,
    [string]$WindowsOfflinePath = "",
    [string]$SeedIP = "",
    [string]$SeedUser = "seeduser"
)

<#
.SYNOPSIS
    Deep-Repair.ps1 — Reparation profonde Windows (SFC + DISM)
    Origine : Manus — integre dans AGI-OS-DAO-Futuristic

.DESCRIPTION
    Outils de reparation systeme avances :
    - SFC (System File Checker) : verifie et repare les fichiers systeme.
    - DISM : repare l'image Windows (online ou offline depuis la Seed/recovery).
    Compatible mode hors-ligne (depuis USB Ventoy / Seed SPD).

.PARAMETER RunSFC
    Execute SFC /scannow pour reparer les fichiers systeme.

.PARAMETER RunDISM
    Execute DISM /Cleanup-Image /RestoreHealth.

.PARAMETER WindowsOfflinePath
    Chemin vers l'installation Windows hors-ligne. Ex: "D:\Windows"
    Utilise depuis la Seed ou un environnement de recuperation.

.PARAMETER SeedIP
    IP de la Seed (blendOS/Ventoy) pour integration future SSH.

.PARAMETER SeedUser
    Utilisateur SSH sur la Seed (defaut: seeduser).

.EXAMPLE
    # Reparation complete en ligne :
    .\Deep-Repair.ps1 -RunDISM -RunSFC

    # Reparation hors-ligne depuis Seed (E: = Ventoy) :
    .\Deep-Repair.ps1 -RunDISM -RunSFC -WindowsOfflinePath "C:\Windows"

    # Avec integration Seed future :
    .\Deep-Repair.ps1 -RunSFC -SeedIP "192.168.1.100"

.NOTES
    Executer en tant qu'Administrateur.
    Recommande : DISM avant SFC.
    Redemarrer apres reparation.
#>

function Test-Admin {
    $currentUser = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    if (-not $currentUser.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        Write-Host "Ce script doit etre execute en tant qu'administrateur. Relancement..." -ForegroundColor Red
        Start-Process powershell -Verb RunAs -ArgumentList "-File `"$($MyInvocation.MyCommand.Path)`" $args"
        exit
    }
}

Test-Admin

Write-Host ""
Write-Host "  AGI-OS-DAO — Deep-Repair.ps1" -ForegroundColor Magenta
Write-Host "  ==============================" -ForegroundColor Magenta
Write-Host "  Host : Windows 11 Pro x64 (ASUS TUF Gaming F15)" -ForegroundColor DarkGray
Write-Host "  Seed : USB Ventoy (SPD)" -ForegroundColor DarkGray
Write-Host ""

$isOffline = -not ([string]::IsNullOrEmpty($WindowsOfflinePath))

if (-not $RunSFC -and -not $RunDISM) {
    Write-Host "  USAGE:" -ForegroundColor Yellow
    Write-Host "    .\Deep-Repair.ps1 -RunDISM -RunSFC              # Reparation complete (recommande)" -ForegroundColor Cyan
    Write-Host "    .\Deep-Repair.ps1 -RunDISM                      # DISM seul" -ForegroundColor Cyan
    Write-Host "    .\Deep-Repair.ps1 -RunSFC                       # SFC seul" -ForegroundColor Cyan
    Write-Host "    .\Deep-Repair.ps1 -RunDISM -RunSFC -WindowsOfflinePath 'D:\Windows'  # Hors-ligne" -ForegroundColor Cyan
    Write-Host ""
    exit 0
}

# TIMESTAMP log
$logPath = "$env:TEMP\deep-repair-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
Write-Host "  LOG: $logPath" -ForegroundColor DarkGray
Write-Host ""

function Write-Log($msg) {
    $line = "[$(Get-Date -Format 'HH:mm:ss')] $msg"
    Add-Content -Path $logPath -Value $line -Encoding UTF8
    Write-Host "  $msg"
}

# ── DISM ──────────────────────────────────────────────────────────────
if ($RunDISM) {
    Write-Host "  [DISM] Reparation image Windows..." -ForegroundColor Yellow
    try {
        if ($isOffline) {
            Write-Log "DISM hors-ligne : $WindowsOfflinePath"
            dism /Image:$WindowsOfflinePath /Cleanup-Image /RestoreHealth /Source:wim:$WindowsOfflinePath\sources\install.wim:1 /LimitAccess
        } else {
            Write-Log "DISM en ligne..."
            dism /Online /Cleanup-Image /RestoreHealth
        }
        Write-Log "DISM termine avec succes."
        Write-Host "  OK: DISM termine." -ForegroundColor Green
    } catch {
        Write-Log "ERREUR DISM: $($_.Exception.Message)"
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# ── SFC ──────────────────────────────────────────────────────────────────
if ($RunSFC) {
    Write-Host "  [SFC] Verification fichiers systeme..." -ForegroundColor Yellow
    try {
        if ($isOffline) {
            Write-Log "SFC hors-ligne : $WindowsOfflinePath"
            sfc /scannow /offbootdir=$WindowsOfflinePath\boot /offwindir=$WindowsOfflinePath
        } else {
            Write-Log "SFC en ligne..."
            sfc /scannow
        }
        Write-Log "SFC termine avec succes."
        Write-Host "  OK: SFC termine." -ForegroundColor Green
    } catch {
        Write-Log "ERREUR SFC: $($_.Exception.Message)"
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# ── SEED INTEGRATION (futur) ──────────────────────────────────────────────
if (-not ([string]::IsNullOrEmpty($SeedIP))) {
    Write-Host "  [SEED] Integration Seed/blendOS (futur)..." -ForegroundColor DarkCyan
    Write-Host "    IP Seed : $SeedIP | User : $SeedUser" -ForegroundColor DarkGray
    Write-Host "    Fonctions futures :" -ForegroundColor DarkGray
    Write-Host "      - Fournir fichiers sains via SSH depuis la Seed" -ForegroundColor DarkGray
    Write-Host "      - Restauration depuis snapshots ZFS/Btrfs de la Seed" -ForegroundColor DarkGray
    Write-Host "      - Diagnostics avances via SSH" -ForegroundColor DarkGray
    Write-Host ""
}

Write-Host "  Deep-Repair termine. LOG: $logPath" -ForegroundColor Magenta
Write-Host "  Redemarrer si des reparations ont ete effectuees." -ForegroundColor Yellow
Write-Host ""
