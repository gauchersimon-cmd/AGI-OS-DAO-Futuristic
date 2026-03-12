#!/bin/bash
echo ""
echo "========================================"
echo "  AGI OS-DAO v3.0.0 - Mac/Linux"
echo "========================================"

command -v node &>/dev/null || { echo "[ERROR] Node.js requis!"; exit 1; }

PKG="npm"
command -v pnpm &>/dev/null && PKG="pnpm"
command -v yarn &>/dev/null && PKG="yarn"

echo "[INFO] Package manager: $PKG"

[ ! -d "node_modules" ] && { echo "[1/2] Installation..."; $PKG install; }

echo "[2/2] Demarrage..."
echo "  http://localhost:3000"

[[ "$OSTYPE" == "darwin"* ]] && open http://localhost:3000 &
[[ "$OSTYPE" == "linux-gnu"* ]] && xdg-open http://localhost:3000 &>/dev/null &

$PKG run dev
