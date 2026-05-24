@echo off
chcp 65001 >nul
echo.
echo ============================================
echo 🚀 ЗАГРУЗКА WEXSIDE НА GITHUB
echo ============================================
echo.

echo 📋 ЧТО НУЖНО СДЕЛАТЬ:
echo.
echo 1. Создай репозиторий на GitHub
echo 2. Скопируй URL репозитория
echo 3. Вставь его ниже
echo.

echo Открыть GitHub для создания репозитория? (Y/N)
set /p choice=

if /i "%choice%"=="Y" (
    start https://github.com/new
    echo.
    echo ✅ GitHub открыт в браузере!
    echo.
    echo Создай репозиторий и скопируй его URL
    echo Например: https://github.com/username/wexside-client.git
    echo.
)

echo.
echo ============================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git не установлен!
    echo.
    echo Установи Git: https://git-scm.com/download/win
    echo.
    echo Или загрузи файлы вручную:
    echo 1. Открой свой репозиторий на GitHub
    echo 2. Нажми "Add file" → "Upload files"
    echo 3. Перетащи все файлы из этой папки
    echo 4. Нажми "Commit changes"
    echo.
    pause
    exit /b 1
)

echo ✅ Git установлен
echo.

echo Введи URL твоего GitHub репозитория:
echo (Например: https://github.com/username/wexside-client.git)
echo.
set /p repo_url=

if "%repo_url%"=="" (
    echo.
    echo ❌ URL не введен!
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo 📤 ЗАГРУЗКА ФАЙЛОВ...
echo ============================================
echo.

git init
if %errorlevel% neq 0 (
    echo ❌ Ошибка инициализации Git
    pause
    exit /b 1
)

git add .
if %errorlevel% neq 0 (
    echo ❌ Ошибка добавления файлов
    pause
    exit /b 1
)

git commit -m "Initial commit - Wexside Client with registration"
if %errorlevel% neq 0 (
    echo ❌ Ошибка создания коммита
    pause
    exit /b 1
)

git branch -M main
git remote add origin %repo_url%

echo.
echo Загружаю файлы на GitHub...
echo Это может занять 2-3 минуты...
echo.

git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo ⚠️ Возможно репозиторий уже существует
    echo Попробуй: git push -f origin main
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo ✅ ФАЙЛЫ ЗАГРУЖЕНЫ НА GITHUB!
echo ============================================
echo.

echo 📋 СЛЕДУЮЩИЕ ШАГИ:
echo.
echo 1. Зайди в свой репозиторий на GitHub
echo 2. Перейди в Settings → Pages
echo 3. Source: main branch, папка: / (root)
echo 4. Нажми Save
echo 5. Подожди 1-2 минуты
echo.

echo Твой сайт будет доступен по адресу:
echo https://ТВОЙ_USERNAME.github.io/НАЗВАНИЕ_РЕПОЗИТОРИЯ/
echo.

echo Открыть репозиторий на GitHub? (Y/N)
set /p choice2=

if /i "%choice2%"=="Y" (
    for /f "tokens=3 delims=/" %%a in ("%repo_url%") do set github_user=%%a
    for /f "tokens=4 delims=/" %%a in ("%repo_url%") do set repo_name=%%a
    set repo_name=%repo_name:.git=%
    start https://github.com/%github_user%/%repo_name%/settings/pages
    echo.
    echo ✅ Страница настроек GitHub Pages открыта!
    echo.
)

echo.
echo ============================================
echo 🎉 ГОТОВО!
echo ============================================
echo.

pause