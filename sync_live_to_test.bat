@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Yamato Shokudo POS - [SYNC LIVE TO TEST APP]

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python was not found on this computer.
    echo Please install Python 3.
    echo.
    pause
    exit /b 1
)

python sync_live_to_test.py

echo.
pause
