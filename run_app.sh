#!/usr/bin/env bash
# ==============================================================================
# 🏮 YAMATO SHOKUDŌ POS - MAC & LINUX LAUNCHER
# ==============================================================================

cd "$(dirname "$0")" || exit 1

echo "================================================================="
echo "  🏮 Starting Yamato Shokudo POS (Mac / Linux)..."
echo "================================================================="
echo ""

if command -v python3 &>/dev/null; then
    python3 server.py
elif command -v python &>/dev/null; then
    python server.py
else
    echo "[ERROR] Python 3 was not found on this computer."
    echo "Please install Python 3 or open index.html directly in your browser."
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi
