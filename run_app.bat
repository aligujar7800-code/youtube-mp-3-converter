@echo off
title YouTube to MP3 - Starter
echo ==========================================
echo Starting YouTube to MP3 Converter
echo ==========================================

:: Start the Backend
echo [1/2] Starting Backend Server...
start cmd /k "title MP3 Backend && cd /d %~dp0backend && ..\venv\Scripts\python.exe main.py"

:: Start the Frontend
echo [2/2] Starting Frontend (Vite)...
start cmd /k "title MP3 Frontend && npm run dev"

echo.
echo ==========================================
echo Everything is starting! 
echo Keep these two windows open while using the app.
echo ==========================================
timeout /t 5

