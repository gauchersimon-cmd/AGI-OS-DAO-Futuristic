param(
    [switch]$ListRestorePoints,
    [int]$RestorePointId,
    [switch]$CreateRestorePoint
)

<#
.SYNOPSIS
    Safe-Reset.ps1 — Restauration securisee Windows
    Origine : Manus — integre dans AGI-OS-DAO-Futuristic

.DESCRIPTION
    Gestion des points de restauration systeme Windows :
    1. Lister les points de restauration disponibles.
    2. Creer un nouveau point de restauration (avant une operation risquee).
    3. Restaurer le systeme a un point specifique.

.PARAMETER ListRestorePoints
    Affiche tous les points de restauration disponibles.

.PARAMETER CreateRestorePoint
    Cree un nouveau point de restauration avant toute operation.

.PARAMETER RestorePointId
    ID du point de restauration cible pour la restauration.

.EXAMPLE
    .\Safe-Reset.ps1 -ListRestorePoints
    .\Safe-Reset.ps1 -CreateRestorePoint
    .\Safe-Reset.ps1 -RestorePointId 5

.NOTES
    Executer en tant qu'Administrateur.
    La restauration redemarrera l'ordinateur.
    Sauvegarder tout travail avant restauration.
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
Write-Host "  AGI-OS-DAO — Safe-Reset.ps1" -ForegroundColor Magenta
Write-Host "  =============================" -ForegroundColor Magenta
Write-Host ""

# ── CREER UN POINT DE RESTAURATION ───────────────────────────────────────────
if ($CreateRestorePoint) {
    Write-Host "  [CREATE] Creation d'un point de restauration..." -ForegroundColor Yellow
    try {
        $desc = "AGI-OS-DAO — $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        Checkpoint-Computer -Description $desc -RestorePointType "MODIFY_SETTINGS"
        Write-Host "  OK: Point de restauration cree: '$desc'" -ForegroundColor Green
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "  Verifiez que la protection systeme est activee sur C:\." -ForegroundColor DarkYellow
        Write-Host "  Activer: Enable-ComputerRestore -Drive 'C:\'" -ForegroundColor DarkGray
    }
    Write-Host ""
}

# ── LISTER LES POINTS ──────────────────────────────────────────────────────────
if ($ListRestorePoints) {
    Write-Host "  [LIST] Points de restauration disponibles:" -ForegroundColor Yellow
    try {
        $points = Get-ComputerRestorePoint
        if ($points) {
            $points | Select-Object SequenceNumber,
                @{N="Date";E={$_.ConvertToDateTime($_.CreationTime).ToString("yyyy-MM-dd HH:mm")}},
                Description,
                RestorePointType |
            Format-Table -AutoSize
        } else {
            Write-Host "  Aucun point de restauration trouve." -ForegroundColor DarkGray
            Write-Host "  Creer un point: .\Safe-Reset.ps1 -CreateRestorePoint" -ForegroundColor DarkGray
        }
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "  Assurez-vous que la protection systeme est activee." -ForegroundColor Yellow
    }
    Write-Host ""
}

# ── RESTAURER ─────────────────────────────────────────────────────────────────
if ($RestorePointId) {
    Write-Host "  [RESTORE] Restauration au point ID: $RestorePointId" -ForegroundColor Yellow
    Write-Host "  ATTENTION: L'ordinateur va redemarrer. Sauvegardez tout." -ForegroundColor Red
    Write-Host ""

    # Afficher le point cible
    try {
        $target = Get-ComputerRestorePoint | Where-Object { $_.SequenceNumber -eq $RestorePointId }
        if ($target) {
            Write-Host "  Cible: $($target.Description) — $($target.ConvertToDateTime($target.CreationTime).ToString('yyyy-MM-dd HH:mm'))" -ForegroundColor Cyan
        } else {
            Write-Host "  WARN: ID $RestorePointId non trouve. Verifiez avec -ListRestorePoints." -ForegroundColor DarkYellow
        }
    } catch {}

    $confirm = Read-Host "`n  Confirmer la restauration (O/N)"
    if ($confirm -eq "O" -or $confirm -eq "o") {
        try {
            Restore-Computer -RestorePoint $RestorePointId
            Write-Host "  Restauration initiee. Redemarrage en cours..." -ForegroundColor Green
        } catch {
            Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "  Verifiez l'ID et reessayez." -ForegroundColor DarkYellow
        }
    } else {
        Write-Host "  Restauration annulee." -ForegroundColor Cyan
    }
    Write-Host ""
}

# ── AIDE si aucun parametre ────────────────────────────────────────────────────
if (-not $ListRestorePoints -and -not $RestorePointId -and -not $CreateRestorePoint) {
    Write-Host "  USAGE:" -ForegroundColor Yellow
    Write-Host "    .\Safe-Reset.ps1 -ListRestorePoints          # Voir les points disponibles" -ForegroundColor Cyan
    Write-Host "    .\Safe-Reset.ps1 -CreateRestorePoint         # Creer un point maintenant" -ForegroundColor Cyan
    Write-Host "    .\Safe-Reset.ps1 -RestorePointId 5           # Restaurer au point ID 5" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  WORKFLOW RECOMMANDE:" -ForegroundColor Yellow
    Write-Host "    1. .\Safe-Reset.ps1 -CreateRestorePoint      # Sauvegarder avant" -ForegroundColor White
    Write-Host "    2. (faire les modifications risquees)" -ForegroundColor DarkGray
    Write-Host "    3. .\Safe-Reset.ps1 -ListRestorePoints       # Verifier les points" -ForegroundColor White
    Write-Host "    4. .\Safe-Reset.ps1 -RestorePointId <ID>     # Restaurer si besoin" -ForegroundColor White
    Write-Host ""
}
