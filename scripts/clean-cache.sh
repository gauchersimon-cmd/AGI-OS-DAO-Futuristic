#!/bin/bash
set -e

echo "Cleaning pnpm cache and lock files..."

# Remove lock file to force fresh install
rm -f /vercel/share/v0-project/pnpm-lock.yaml

# Remove node_modules
rm -rf /vercel/share/v0-project/node_modules

# Clear pnpm cache
pnpm store prune || true

echo "Cache cleaned successfully!"
echo "Dependencies will be reinstalled with correct versions on next build"
