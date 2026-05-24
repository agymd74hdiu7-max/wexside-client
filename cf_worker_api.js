// CLOUDFLARE WORKERS API ДЛЯ WEXSIDE САЙТА
// Использует твой API ключ: cfut_CWUUD7566IJDhUZEDxtzYSIvAEH7A2RvZmgNdfRe259fdbce

const CF_API_KEY = 'cfut_CWUUD7566IJDhUZEDxtzYSIvAEH7A2RvZmgNdfRe259fdbce';
const CF_ACCOUNT_ID = 'YOUR_ACCOUNT_ID'; // Нужно заменить на твой Account ID
const CF_WORKER_NAME = 'wexside-auth-api';

// Базовые URL
const CF_API_BASE = 'https://api.cloudflare.com/client/v4';
const WORKER_BASE = `https://${CF_WORKER_NAME}.${CF_ACCOUNT_ID}.workers.dev`;

// Класс для работы с Cloudflare Workers API
class CloudflareWorkersAPI {
  constructor() {
    this.apiKey = CF_API_KEY;
    this.accountId = CF_ACCOUNT_ID;
    this.workerName = CF_WORKER_NAME;
    this.baseUrl = CF_API_BASE;
    this.workerUrl = WORKER_BASE;
    
    // Локальное хранилище пользователей (для демо)
    this.localUsers = this.loadLocalUsers();
  }
  
  // Загрузка пользователей из localStorage
  loadLocalUsers() {
    try {
      if (typeof localStorage !== 'undefined') {
        const users = localStorage.getItem('wexside_users');
        return users ? JSON.parse(users) : [];
      }
    } catch (e) {
      console.log('LocalStorage недоступен, используем память');
    }
    return [];
  }
  
  // Сохранение пользователей
  saveLocalUsers() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wexside_users', JSON.stringify(this.localUsers));
      }
    } catch (e) {
      console.log('Не удалось сохранить в localStorage');
    }
  }
  
  // Регистрация нового пользователя
  async register(userData) {
    console.log('📝 Регистрация пользователя:', userData.email);
    
    // Проверяем существует ли пользователь
    const existingUser = this.localUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        success: false,
        error: 'Пользователь с таким email уже существует'
      };
    }
    
    // Создаем нового пользователя
    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      username: userData.username || userData.email.split('@')[0],
      password: userData.password, // В реальном приложении нужно хэшировать!
      createdAt: new Date().toISOString(),
      verified: false,
      balance: 0,
      premium: false,
      purchases: []
    };
    
    // Добавляем в локальное хранилище
    this.localUsers.push(newUser);
    this.saveLocalUsers();
    
    // Пытаемся отправить в Cloudflare Workers (если настроен)
    try {
      await this.sendToCloudflareWorker('register', newUser);
    } catch (error) {
      console.log('⚠️ Cloudflare Worker не отвечает, сохраняем локально');
    }
    
    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        createdAt: newUser.createdAt,
        balance: newUser.balance,
        premium: newUser.premium
      },
      token: this.generateToken(newUser.id)
    };
  }
  
  // Авторизация пользователя
  async login(email, password) {
    console.log('🔐 Авторизация пользователя:', email);
    
    // Ищем пользователя локально
    const user = this.localUsers.find(u => 
      u.email === email && u.password === password
    );
    
    if (!user) {
      return {
        success: false,
        error: 'Неверный email или пароль'
      };
    }
    
    // Пытаемся авторизоваться через Cloudflare Workers
    try {
      const cfResponse = await this.sendToCloudflareWorker('login', { email, password });
      if (cfResponse.success) {
        return cfResponse;
      }
    } catch (error) {
      console.log('⚠️ Cloudflare Worker не отвечает, используем локальную авторизацию');
    }
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        balance: user.balance,
        premium: user.premium,
        purchases: user.purchases
      },
      token: this.generateToken(user.id)
    };
  }
  
  // Получение информации о пользователе
  async getUser(userId, token) {
    if (!this.verifyToken(token, userId)) {
      return {
        success: false,
        error: 'Неверный токен'
      };
    }
    
    const user = this.localUsers.find(u => u.id === userId);
    if (!user) {
      return {
        success: false,
        error: 'Пользователь не найден'
      };
    }
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        balance: user.balance,
        premium: user.premium,
        purchases: user.purchases,
        verified: user.verified
      }
    };
  }
  
  // Обновление баланса
  async updateBalance(userId, amount, token) {
    if (!this.verifyToken(token, userId)) {
      return {
        success: false,
        error: 'Неверный токен'
      };
    }
    
    const userIndex = this.localUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return {
        success: false,
        error: 'Пользователь не найден'
      };
    }
    
    this.localUsers[userIndex].balance += amount;
    this.saveLocalUsers();
    
    return {
      success: true,
      newBalance: this.localUsers[userIndex].balance
    };
  }
  
  // Покупка продукта
  async purchaseProduct(userId, productId, token) {
    if (!this.verifyToken(token, userId)) {
      return {
        success: false,
        error: 'Неверный токен'
      };
    }
    
    const userIndex = this.localUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return {
        success: false,
        error: 'Пользователь не найден'
      };
    }
    
    const user = this.localUsers[userIndex];
    const product = this.getProductById(productId);
    
    if (!product) {
      return {
        success: false,
        error: 'Продукт не найден'
      };
    }
    
    if (user.balance < product.price) {
      return {
        success: false,
        error: 'Недостаточно средств'
      };
    }
    
    // Списание средств
    user.balance -= product.price;
    user.purchases.push({
      productId,
      productName: product.name,
      price: product.price,
      purchasedAt: new Date().toISOString()
    });
    
    this.saveLocalUsers();
    
    return {
      success: true,
      purchase: {
        productId,
        productName: product.name,
        price: product.price,
        purchasedAt: user.purchases[user.purchases.length - 1].purchasedAt,
        licenseKey: this.generateLicenseKey()
      },
      newBalance: user.balance
    };
  }
  
  // Генерация токе��а (упрощенная)
  generateToken(userId) {
    return `wexside_token_${userId}_${Date.now()}_${Math.random().toString(36).substr(2)}`;
  }
  
  // Проверка токена
  verifyToken(token, userId) {
    return token && token.startsWith(`wexside_token_${userId}_`);
  }
  
  // Генерация лицензионного ключа
  generateLicenseKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) key += '-';
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }
  
  // Получение продукта по ID
  getProductById(productId) {
    const products = this.getProducts();
    return products.find(p => p.id === productId);
  }
  
  // Получение списка продуктов
  getProducts() {
    return [
      {
        id: 'minecraft_basic',
        name: 'Wexside для Minecraft (Basic)',
        price: 499,
        currency: 'RUB',
        description: 'Базовый клиент для Minecraft с основными функциями',
        features: ['ESP', 'X-Ray', 'Auto Clicker', 'Поддержка 24/7'],
        image: 'assets/wex-orange-5Wha1F1r.png'
      },
      {
        id: 'minecraft_premium',
        name: 'Wexside для Minecraft (Premium)',
        price: 999,
        currency: 'RUB',
        description: 'Премиум клиент для Minecraft со всеми функциями',
        features: ['ESP', 'X-Ray', 'Fly', 'Speed Hack', 'Anti-Cheat Bypass', 'Приоритетная поддержка'],
        image: 'assets/wex-red-DHhJy-mu.png'
      },
      {
        id: 'cs2_basic',
        name: 'Wexside для CS2 (Basic)',
        price: 799,
        currency: 'RUB',
        description: 'Клиент для CS2 с базовыми читами',
        features: ['Wallhack', 'Aimbot', 'No Recoil', 'Bunny Hop'],
        image: 'assets/wex-purple-Bghgu--T.png'
      },
      {
        id: 'cs2_premium',
        name: 'Wexside для CS2 (Premium)',
        price: 1499,
        currency: 'RUB',
        description: 'Полный клиент для CS2 со всеми функциями',
        features: ['Perfect Aimbot', 'ESP с информацией', 'Triggerbot', 'Skin Changer', 'Legit Mode'],
        image: 'assets/wex-violet-C9_i5vCx.png'
      },
      {
        id: 'fortnite',
        name: 'Wexside для Fortnite',
        price: 1299,
        currency: 'RUB',
        description: 'Мощный клиент для Fortnite',
        features: ['Aimbot', 'ESP', 'No Spread', 'Instant Revive', 'Loot ESP'],
        image: 'assets/wex-gray-BdD-Wcm4.png'
      },
      {
        id: 'valorant',
        name: 'Wexside для Valorant',
        price: 1699,
        currency: 'RUB',
        description: 'Безопасный клиент для Valorant',
        features: ['Rage Mode', 'Legit Mode', 'Skin Changer', 'Spoofer', 'HWID Spoofer'],
        image: 'assets/card1-6I0V47UE.png'
      }
    ];
  }
  
  // Отправка данных в Cloudflare Worker
  async sendToCloudflareWorker(action, data) {
    // Если Worker не настроен, выбрасываем ошибку
    if (this.workerUrl.includes('YOUR_ACCOUNT_ID')) {
      throw new Error('Cloudflare Worker не настроен');
    }
    
    const response = await fetch(`${this.workerUrl}/api/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Cloudflare Worker error: ${response.status}`);
    }
    
    return await response.json();
  }
  
  // Создание Cloudflare Worker (если нужно)
  async createCloudflareWorker() {
    console.log('🚀 Создание Cloudflare Worker...');
    
    // Код Worker для развертывания
    const workerCode = `
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
  
  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers })
  }
  
  // API routes
  if (path.startsWith('/api/')) {
    const action = path.split('/api/')[1]
    
    try {
      const data = await request.json()
      let result
      
      switch(action) {
        case 'register':
          result = await handleRegister(data)
          break
        case 'login':
          result = await handleLogin(data)
          break
        case 'user':
          result = await handleGetUser(data)
          break
        default:
          result = { error: 'Unknown action' }
      }
      
      return new Response(JSON.stringify(result), {
        headers: { ...headers, 'Content-Type': 'application/json' }
      })
      
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      })
    }
  }
  
  // Default response
  return new Response('Wexside API Worker', { headers })
}

// In-memory storage (in real worker use KV)
let users = []

async function handleRegister(data) {
  const { email, username, password } = data
  
  // Check if user exists
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'User already exists' }
  }
  
  const user = {
    id: Date.now().toString(),
    email,
    username: username || email.split('@')[0],
    password, // Hash in production!
    createdAt: new Date().toISOString(),
    balance: 0,
    premium: false
  }
  
  users.push(user)
  
  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      balance: user.balance,
      premium: user.premium
    }
  }
}

async function handleLogin(data) {
  const { email, password } = data
  const user = users.find(u => u.email === email && u.password === password)
  
  if (!user) {
    return { success: false, error: 'Invalid credentials' }
  }
  
  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      balance: user.balance,
      premium: user.premium
    }
  }
}

async function handleGetUser(data) {
  const { userId } = data
  const user = users.find(u => u.id === userId)
  
  if (!user) {
    return { success: false, error: 'User not found' }
  }
  
  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      balance: user.balance,
      premium: user.premium
    }
  }
}
`;
    
    // Здесь должен быть код для создания Worker через Cloudflare API
    // Но для простоты вернем инструкции
    
    return {
      success: true,
      message: 'Код Cloudflare Worker готов к развертыванию',
      code: workerCode,
      instructions: [
        '1. Зайдите в Cloudflare Dashboard',
        '2. Создайте новый Worker',
        '3. Вставьте этот код',
        '4. Сохраните и опубликуйте',
        `5. Ваш Worker URL: https://${CF_WORKER_NAME}.${CF_ACCOUNT_ID}.workers.dev`
      ]
    };
  }
}

// Создаем глобальный экземпляр API
const cfApi = new CloudflareWorkersAPI();

// Экспортируем для использования в браузере
if (typeof window !== 'undefined') {
  window.cfApi = cfApi;
  window.wexsideAuth = cfApi;
  
  console.log('🚀 Cloudflare Workers API загружен');
  console.log('🔑 API ключ:', CF_API_KEY.substring(0, 10) + '...' + CF_API_KEY.substring(CF_API_KEY.length - 10));
  console.log('💡 Используйте window.cfApi для работы с API');
  console.log('💡 Используйте window.cfApi.createCloudflareWorker() для создания Worker');
}

// Экспорт для Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = cfApi;
}