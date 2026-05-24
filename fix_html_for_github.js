const fs = require('fs');
const path = require('path');

console.log('🔧 Исправление HTML файлов для GitHub Pages...\n');

// Получаем все HTML файлы
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  console.log(`📄 Обработка: ${file}`);
  
  let content = fs.readFileSync(file, 'utf8');
  let changes = [];
  
  // 1. Удаляем ссылку на несуществующий images.css
  if (content.includes('main_images/images.css')) {
    content = content.replace(/<link rel="stylesheet" href="main_images\/images\.css">/g, '');
    changes.push('  ❌ Удалена ссылка на main_images/images.css');
  }
  
  // 2. Удаляем весь fallback контент с примерами изображений (он не нужен на продакшене)
  const fallbackRegex = /<div style="margin-top: 30px;[\s\S]*?<\/div>\s*<\/div>/;
  if (fallbackRegex.test(content)) {
    content = content.replace(fallbackRegex, '');
    changes.push('  ❌ Удален fallback контент с примерами');
  }
  
  // 3. Упрощаем loading экран
  const loadingDivRegex = /<div class="loading">[\s\S]*?<\/div>\s*<\/div>/;
  if (loadingDivRegex.test(content)) {
    const simpleLoading = `<div class="loading">
        <div class="loading-spinner"></div>
        <div class="loading-text">Wexside Client загружается...</div>
      </div>`;
    content = content.replace(loadingDivRegex, simpleLoading);
    changes.push('  ✅ Упрощен loading экран');
  }
  
  // 4. Проверяем что пути к assets правильные
  const hasCorrectPaths = content.includes('/wexside-client/assets/');
  if (hasCorrectPaths) {
    changes.push('  ✅ Пути к assets корректны');
  } else {
    // Исправляем пути если они неправильные
    content = content.replace(/href="assets\//g, 'href="/wexside-client/assets/');
    content = content.replace(/src="assets\//g, 'src="/wexside-client/assets/');
    changes.push('  ✅ Исправлены пути к assets');
  }
  
  // Сохраняем файл
  fs.writeFileSync(file, content, 'utf8');
  
  if (changes.length > 0) {
    console.log(changes.join('\n'));
  }
  console.log('');
});

console.log('✅ Все HTML файлы исправлены!\n');
console.log('📋 Следующие шаги:');
console.log('1. git add .');
console.log('2. git commit -m "Fix HTML files for GitHub Pages"');
console.log('3. git push');
