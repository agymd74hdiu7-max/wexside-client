@echo off
title WexSide Server
color 0a
echo ============================================
echo    🚀 WEXSIDE CLIENT - ЗАПУСК СЕРВЕРА
echo ============================================
echo.
cd /d "C:\Users\agymd\OneDrive\Desktop\Project\wexside_sources"
echo Запускаю сервер на http://localhost:3000
echo.
npx serve . -p 3000
pause