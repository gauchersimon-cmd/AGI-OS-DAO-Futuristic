<#
.SYNOPSIS
    start-vscode.ps1 — Lance VS Code sur le workspace AGI-OS-DAO
    Lit les cles API depuis les VARIABLES D'ENVIRONNEMENT SYSTEME Windows.
    Ne requiert PAS de fichier .env.

.DESCRIPTION
    - Verifie les cles API dans les variables systeme existantes
    - Ouvre le workspace AGI-OS-DAO.code-workspace sur E:\
    - Lance VS Code avec le bon profil

.USAGE
    PowerShell (Admin) :
    .\scripts\windows\start-vscode.ps1

    Ou depuis n'importe ou :
    irm https://raw.githubusercontent.com/gauchersimon-cmd/AGI-OS-DAO-Futuristic/main/scripts/windows/start-vscode.ps1 | iex
#>

$WORKSPACE_FILE = "E:\VSCode-Workspace\AGI-OS-DAO.code-workspace"
$REPO_PATH      = "E:\VSCode-Workspace\projects\AGI-OS-DAO-Futuristic"

Write-Host ""
Write-Host "  AGI-OS-DAO — VS Code Launcher" -ForegroundColor Magenta
Write-Host "  ================================" -ForegroundColor Magenta
Write-Host ""

# ── VERIF VARIABLES D'ENVIRONNEMENT SYSTEME (cles API deja sur le PC) ───────────
Write-Host "  [API KEYS] Verification variables systeme..." -ForegroundColor Yellow

$apiVars = @(
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
    "GOOGLE_API_KEY",
    "XAI_API_KEY"
)

foreach ($v in $apiVars) {
    # Lire depuis Machine (systeme) ET User
    $valMachine = [System.Environment]::GetEnvironmentVariable($v, "Machine")
    $valUser    = [System.Environment]::GetEnvironmentVariable($v, "User")
    $val        = if ($valMachine) { $valMachine } elseif ($valUser) { $valUser } else { $null }

    if ($val) {
        $masked = $val.Substring(0, [Math]::Min(8, $val.Length)) + "****"
        Write-Host "    OK  $v = $masked" -ForegroundColor Green
    } else {
        Write-Host "    --  $v non definie" -ForegroundColor DarkGray
    }
}

# Ollama local
$ollamaHost = [System.Environment]::GetEnvironmentVariable("OLLAMA_HOST", "Machine")
if (-not $ollamaHost) { $ollamaHost = "http://localhost:11434" }
Write-Host "    OK  OLLAMA_HOST = $ollamaHost" -ForegroundColor Cyan

Write-Host ""

# ── VERIF WORKSPACE ───────────────────────────────────────────────────────────
if (-not (Test-Path $WORKSPACE_FILE)) {
    Write-Host "  WARN: $WORKSPACE_FILE introuvable." -ForegroundColor DarkYellow
    Write-Host "  Lance d'abord: .\Setup-VSCode-Agent.ps1" -ForegroundColor DarkYellow
    # Ouvre quand meme le repo direct
    if (Test-Path $REPO_PATH) {
        Write-Host "  Ouverture du repo directement..." -ForegroundColor Gray
        code $REPO_PATH
    } else {
        Write-Host "  Ouverture VS Code..." -ForegroundColor Gray
        code .
    }
} else {
    Write-Host "  Ouverture workspace: $WORKSPACE_FILE" -ForegroundColor Cyan
    code $WORKSPACE_FILE
}

Write-Host ""
Write-Host "  VS Code ouvert. Bonne session !" -ForegroundColor Green
Write-Host ""
