@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Yamato Shokudo POS - [TEST / STAGING ENVIRONMENT]

echo =================================================================
echo   🧪 Starting Yamato Shokudo POS [TEST ENVIRONMENT]...
echo =================================================================
echo.
echo   * This is your dedicated test environment for new features.
echo   * All changes made in 'test_app\' DO NOT affect the LIVE POS!
echo   * The LIVE app remains safe and intact.
echo.

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python was not found on this computer.
    echo Please install Python 3 or ensure it is in your system PATH.
    echo.
    pause
    exit /b 1
)

if not exist "test_app\index.html" (
    echo [!] 'test_app' directory not initialized. Initializing now...
    python sync_live_to_test.py --force
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to initialize test_app folder.
        pause
        exit /b 1
    )
)

cd test_app
python server.py

if %errorlevel% neq 0 (
    echo.
    echo [!] Test server stopped or encountered an issue.
    pause
)
