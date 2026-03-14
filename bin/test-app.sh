#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "[1/3] Running unit tests"
npm test

echo "[2/3] Running lint"
npm run lint

echo "[3/3] Building production app"
npm run build

echo "All checks passed."
