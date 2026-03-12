@echo off
title AGI OS-DAO v3.0 - Windows
color 0B
echo.
echo  ========================================
echo    AGI OS-DAO v3.0.0 - Windows Setup
echo  ========================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js requis! https://nodejs.org
    pause
    exit /b 1
)

where pnpm >nul 2>nul
if %ERRORLEVEL% EQU 0 (set PKG=pnpm) else (set PKG=npm)

echo [INFO] Package manager: %PKG%

if not exist "node_modules" (
    echo [1/2] Installation des dependances...
    %PKG% install
)

echo [2/2] Demarrage du serveur...
echo.
echo  http://localhost:3000
echo  Ctrl+C pour arreter
echo.
start http://localhost:3000
%PKG% run dev
