@echo off
title WexSide Server
color 0a
echo ============================================
echo    🚀 WEXSIDE CLIENT - ЗАПУСК СЕРВЕРА
echo ============================================
echo.
cd /d "Путь к папке"
echo Запускаю сервер на http://localhost:3000
echo.
npx serve . -p 3000
pause
