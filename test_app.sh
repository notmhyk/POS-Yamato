#!/usr/bin/env bash
# ==============================================================================
# 🧪 YAMATO SHOKUDŌ POS - TEST APP LAUNCHER (MAC & LINUX)
# ==============================================================================

cd "$(dirname "$0")" || exit 1

echo "================================================================="
echo "  🧪 Starting Yamato Shokudo POS [TEST ENVIRONMENT]..."
echo "================================================================="
echo "  * Dedicated test environment for new features."
echo "  * Changes in 'test_app/' DO NOT affect the LIVE POS!"
echo ""

if command -v python3 &>/dev/null; then
    PY_CMD="python3"
elif command -v python &>/dev/null; then
    PY_CMD="python"
else
    echo "[ERROR] Python 3 was not found on this computer."
    read -p "Press Enter to exit..."
    exit 1
fi

if [ ! -f "test_app/index.html" ]; then
    echo "[!] test_app folder not initialized. Initializing..."
    $PY_CMD sync_live_to_test.py --force
fi

cd test_app || exit 1
$PY_CMD server.py
