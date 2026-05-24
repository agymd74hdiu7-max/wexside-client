# 🚀 ДЕПЛОЙ WEXSIDE ЧЕРЕЗ GITHUB PAGES

## ЗА 5 МИНУТ ПОЛУЧИШЬ РАБОЧИЙ САЙТ!

### ШАГ 1: Создай репозиторий на GitHub

1. Зайди на https://github.com/new
2. Название: `wexside-client` (или любое другое)
3. Сделай **Public** (для бесплатного GitHub Pages)
4. НЕ добавляй README, .gitignore (уже есть)
5. Нажми **Create repository**

### ШАГ 2: Загрузи файлы

**ВАРИАНТ А: Через Git (если установлен)**

```bash
cd wexside_sources
git init
git add .
git commit -m "Initial commit - Wexside Client"
git branch -M main
git remote add origin https://github.com/ТВОЙ_USERNAME/wexside-client.git
git push -u origin main
```

**ВАРИАНТ Б: Через веб-интерфейс GitHub**

1. На странице репозитория нажми **uploading an existing file**
2. Перетащи ВСЕ файлы из папки `wexside_sources`
3. Подожди пока загрузятся (может занять 2-3 минуты)
4. Нажми **Commit changes**

### ШАГ 3: Включи GitHub Pages

1. В репозитории перейди в **Settings**
2. Слева найди **Pages**
3. В **Source** выбери **main** branch
4. Папка: **/ (root)**
5. Нажми **Save**

### ШАГ 4: Подожди 1-2 минуты

GitHub автоматически задеплоит сайт!

### ШАГ 5: Получи ссылку

Твой сайт будет доступен по адресу:

```
https://ТВОЙ_USERNAME.github.io/wexside-client/
```

Например, если твой username `john123`, то:
```
https://john123.github.io/wexside-client/
```

---

## 📋 СТРАНИЦЫ САЙТА

После деплоя:

- **Главная**: https://ТВОЙ_USERNAME.github.io/wexside-client/
- **Регистрация**: https://ТВОЙ_USERNAME.github.io/wexside-client/wexside_signup.html
- **Вход**: https://ТВОЙ_USERNAME.github.io/wexside-client/wexside_signin.html
- **Продукты**: https://ТВОЙ_USERNAME.github.io/wexside-client/wexside_products.html
- **Кабинет**: https://ТВОЙ_USERNAME.github.io/wexside-client/wexside_cabinet.html
- **FAQ**: https://ТВОЙ_USERNAME.github.io/wexside-client/wexside_faq.html

---

## 🎨 КАСТОМНЫЙ ДОМЕН (ОПЦИОНАЛЬНО)

Хочешь свой домен типа `wexside.com`?

1. Купи домен (например на Namecheap)
2. В настройках домена добавь CNAME запись:
   ```
   CNAME: www -> ТВОЙ_USERNAME.github.io
   ```
3. В GitHub Settings → Pages → Custom domain
4. Введи свой домен
5. Включи **Enforce HTTPS**

---

## ⚡ БЫСТРОЕ ОБНОВЛЕНИЕ САЙТА

Если нужно обновить файлы:

**Через Git:**
```bash
git add .
git commit -m "Update"
git push
```

**Через веб:**
1. Открой файл на GitHub
2. Нажми карандаш (Edit)
3. Внеси изменения
4. Commit changes

Сайт обновится автоматически через 1-2 минуты!

---

## ✅ ПРЕИМУЩЕСТВА GITHUB PAGES

- ✅ **Бесплатно** навсегда
- ✅ **SSL сертификат** автоматически
- ✅ **CDN** по всему миру
- ✅ **Безлимитный трафик**
- ✅ **Автоматические обновления**
- ✅ **Можно свой домен**

---

## 🔧 НАСТРОЙКА РЕГИСТРАЦИИ

Регистрация работает локально (в браузере пользователя).

Для реальной базы данных:
1. Используй Firebase (бесплатно)
2. Или Supabase (бесплатно)
3. Или Cloudflare Workers (инструкция в DEPLOY_INSTRUCTIONS.md)

---

## 🆘 ПРОБЛЕМЫ?

### Сайт не открывается
- Подожди 5 минут после включения Pages
- Проверь что репозиторий **Public**
- Проверь что выбрана ветка **main**

### Изображения не загружаются
- Убедись что папка `assets/` загружена
- Проверь что в ней 69 файлов

### Белый экран
- Открой консоль браузера (F12)
- Посмотри ошибки
- Проверь что все HTML файлы загружены

---

## 📞 ГОТОВО!

После деплоя скинь мне ссылку, проверю что всё работает! 🚀

**Твоя ссылка будет:**
```
https://ТВОЙ_USERNAME.github.io/wexside-client/
```