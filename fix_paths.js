const fs = require('fs');
const BASE = '/wexside-client';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/href="assets\//g, `href="${BASE}/assets/`);
  content = content.replace(/src="assets\//g, `src="${BASE}/assets/`);
  fs.writeFileSync(file, content);
  console.log(`✅ ${file}`);
});

console.log('\n✅ Готово!');