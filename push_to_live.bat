@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Yamato Shokudo POS - [PROMOTE TEST TO LIVE & GITHUB]

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python was not found on this computer.
    echo Please install Python 3 or ensure it is in your system PATH.
    echo.
    pause
    exit /b 1
)

python push_to_live.py

echo.
pause
