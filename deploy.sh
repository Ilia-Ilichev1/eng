#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "Pulling latest..."
git pull

echo "Installing server dependencies..."
cd server
npm ci

echo "Restarting app..."
pm2 restart eng --update-env || pm2 start src/index.js --name eng --node-args="--max-old-space-size=256"

echo "Done. Check status with: pm2 status"