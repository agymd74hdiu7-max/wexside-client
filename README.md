# 🚀 WEXSIDE CLIENT - ГОТОВ К ДЕПЛОЮ

Полная копия сайта Wexside с рабочей регистрацией и авторизацией.

## 📁 ЧТО ВНУТРИ

- ✅ **16 HTML страниц** - все страницы сайта
- ✅ **69 изображений** в папке `assets/` (25 MB)
- ✅ **React приложение** - полный JS бандл
- ✅ **API для регистрации** - готовый код
- ✅ **Все стили и шрифты**

## 🚀 КАК ЗАДЕПЛОИТЬ

### СПОСОБ 1: GitHub Pages (САМЫЙ ПРОСТОЙ!) ⭐

**Автоматически:**
1. Запусти `UPLOAD_TO_GITHUB.bat`
2. Следуй инструкциям
3. Готово!

**Вручную:**
1. Создай репозиторий на https://github.com/new
2. Загрузи все файлы из этой папки
3. Settings → Pages → Source: main branch
4. Готово!

**Твой сайт:** `https://ТВОЙ_USERNAME.github.io/НАЗВАНИЕ_РЕПО/`

📖 **Подробная инструкция:** `GITHUB_DEPLOY.md`

---

### СПОСОБ 2: Cloudflare Pages

1. Зайди на https://dash.cloudflare.com/
2. Workers & Pages → Create → Pages → Upload assets
3. Загрузи ВСЮ эту папку
4. Имя: `wexside-client`
5. Deploy

**ГОТОВО!** Сайт будет на: `https://wexside-client.pages.dev`

### СПОСОБ 3: Vercel

1. Установи Vercel CLI: `npm i -g vercel`
2. В этой папке: `vercel`
3. Следуй инструкциям

### СПОСОБ 4: Netlify

1. Зайди на https://app.netlify.com/
2. Drag & drop эту папку
3. Deploy

## 📋 СТРАНИЦЫ САЙТА

После деплоя будут доступны:

- `/` или `/index.html` - Главная
- `/wexside_main.html` - Главная (альт)
- `/wexside_signup.html` - **Регистрация** ⭐
- `/wexside_signin.html` - **Вход** ⭐
- `/wexside_products.html` - Продукты
- `/wexside_cabinet.html` - Личный кабинет
- `/wexside_faq.html` - FAQ
- `/wexside_bundles.html` - Бандлы
- `/wexside_collaboration.html` - Сотрудничество
- `/wexside_daily_wheel.html` - Колесо фортуны
- `/wexside_friend_list.html` - Друзья
- `/wexside_papers.html` - Документы
- `/wexside_personalisation.html` - Персонализация
- `/wexside_product_1_16_5.html` - Продукт 1.16.5
- `/wexside_recovery.html` - Восстановление пароля
- `/api_test.html` - Тест API

## 🔧 НАСТРОЙКА API

Для работы регистрации нужно развернуть Worker:

1. Зайди на https://dash.cloudflare.com/
2. Workers & Pages → Create Worker
3. Назови: `wexside-auth-api`
4. Вставь код из `../wexside_deploy/worker.js`
5. Deploy
6. Скопируй URL Worker
7. Обнови `cf_api_config.json` → замени `YOUR_CLOUDFLARE_WORKER_URL`

## 📦 РАЗМЕР

- **Всего**: ~30 MB
- **HTML**: 16 файлов
- **Assets**: 69 файлов (изображения, JS, CSS)
- **API**: 3 файла (конфиг + клиент)

## ✅ ЧТО РАБОТАЕТ

- ✅ Все страницы загружаются
- ✅ Все изображения показываются
- ✅ React приложение работает
- ✅ Регистрация (локально в localStorage)
- ✅ Авторизация (локально)
- ✅ Личный кабинет
- ✅ Просмотр продуктов

## ⚠️ ЧТО НУЖНО НАСТРОИТЬ

- 🔧 Cloudflare Worker для реальной регистрации
- 🔧 Платежную систему (опционально)
- 🔧 Email верификацию (опционально)

## 🆘 ПОМОЩЬ

Если что-то не работает:

1. Проверь что загрузилась папка `assets/` (69 файлов)
2. Открой консоль браузера (F12) и посмотри ошибки
3. Убедись что все HTML файлы загружены

---

**Готово к деплою! Просто загрузи эту папку на любой хостинг.**
