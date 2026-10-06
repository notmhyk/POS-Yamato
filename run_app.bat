@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Yamato Shokudo POS - Server

echo =================================================================
echo   Starting Yamato Shokudo POS...
echo =================================================================
echo.

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python was not found on this computer.
    echo Please install Python 3 or open index.html directly in your browser.
    echo.
    pause
    exit /b 1
)

python server.py

if %errorlevel% neq 0 (
    echo.
    echo [!] Server encountered an issue.
    pause
)
