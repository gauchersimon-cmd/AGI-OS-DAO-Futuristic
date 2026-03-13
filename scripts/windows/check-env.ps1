<#
.SYNOPSIS
    check-env.ps1 — Verifie TOUTES les variables d'environnement systeme
    necessaires au projet AGI-OS-DAO-Futuristic.
    LIT uniquement depuis le systeme Windows (Machine + User).
    Aucun fichier .env requis.

.USAGE
    .\scripts\windows\check-env.ps1
#>

Write-Host ""
Write-Host "  AGI-OS-DAO — ENV CHECK" -ForegroundColor Magenta
Write-Host "  ======================" -ForegroundColor Magenta
Write-Host "  Source: Variables d'environnement systeme Windows" -ForegroundColor DarkGray
Write-Host "  (Machine + User — PAS de fichier .env)" -ForegroundColor DarkGray
Write-Host ""

$checks = @(
    @{ Name="OPENAI_API_KEY";        Required=$false; Category="LLM API" },
    @{ Name="ANTHROPIC_API_KEY";     Required=$false; Category="LLM API" },
    @{ Name="GOOGLE_API_KEY";        Required=$false; Category="LLM API" },
    @{ Name="XAI_API_KEY";           Required=$false; Category="LLM API" },
    @{ Name="OLLAMA_HOST";           Required=$false; Category="Ollama Local" },
    @{ Name="OLLAMA_MODEL";          Required=$false; Category="Ollama Local" },
    @{ Name="CUDA_VISIBLE_DEVICES";  Required=$false; Category="NVIDIA" },
    @{ Name="GPU_VRAM_LIMIT_GB";     Required=$false; Category="NVIDIA" },
    @{ Name="NEXT_PUBLIC_API_URL";   Required=$false; Category="Next.js" },
    @{ Name="BACKEND_HOST";          Required=$false; Category="Litestar" },
    @{ Name="BACKEND_PORT";          Required=$false; Category="Litestar" },
    @{ Name="AGENT_MODE";            Required=$false; Category="Agent" },
    @{ Name="AGENT_LOG_LEVEL";       Required=$false; Category="Agent" },
    @{ Name="AGENT_MEMORY_PATH";     Required=$false; Category="Agent" },
    @{ Name="SEED_DRIVE";            Required=$false; Category="SPD Seed" },
    @{ Name="SEED_WORKSPACE";        Required=$false; Category="SPD Seed" }
)

$currentCategory = ""
$found  = 0
$missing = 0

foreach ($c in $checks) {
    if ($c.Category -ne $currentCategory) {
        $currentCategory = $c.Category
        Write-Host "  [$currentCategory]" -ForegroundColor Yellow
    }

    $valM = [System.Environment]::GetEnvironmentVariable($c.Name, "Machine")
    $valU = [System.Environment]::GetEnvironmentVariable($c.Name, "User")
    $val  = if ($valM) { $valM } elseif ($valU) { $valU } else { $null }
    $src  = if ($valM) { "Machine" } elseif ($valU) { "User" } else { $null }

    if ($val) {
        $masked = if ($c.Name -like "*KEY*") {
            $val.Substring(0, [Math]::Min(10, $val.Length)) + "..."
        } else { $val }
        Write-Host "    OK  $($c.Name) = $masked  [$src]" -ForegroundColor Green
        $found++
    } else {
        $label = if ($c.Required) { "MANQUANT" } else { "non definie" }
        $color = if ($c.Required) { "Red" } else { "DarkGray" }
        Write-Host "    --  $($c.Name) $label" -ForegroundColor $color
        $missing++
    }
}

Write-Host ""
Write-Host "  RESUME: $found definie(s), $missing non definie(s)" -ForegroundColor Cyan
Write-Host ""

# ── COMMENT AJOUTER UNE VARIABLE SYSTEME ─────────────────────────────────────
Write-Host "  AIDE — Ajouter une variable systeme (PowerShell Admin):" -ForegroundColor DarkYellow
Write-Host "    [System.Environment]::SetEnvironmentVariable('OPENAI_API_KEY', 'sk-...', 'Machine')" -ForegroundColor Gray
Write-Host "    [System.Environment]::SetEnvironmentVariable('ANTHROPIC_API_KEY', 'sk-ant-...', 'Machine')" -ForegroundColor Gray
Write-Host "    [System.Environment]::SetEnvironmentVariable('GOOGLE_API_KEY', 'AIza...', 'Machine')" -ForegroundColor Gray
Write-Host ""
Write-Host "  OU via GUI: Panneau de config -> Systeme -> Variables d'environnement" -ForegroundColor DarkGray
Write-Host ""
