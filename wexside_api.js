// API КЛИЕНТ ДЛЯ WEXSIDE С ИНТЕГРАЦИЕЙ CLOUDFLARE WORKERS
const CF_API_CONFIG = {
  "apiKey": "YOUR_CLOUDFLARE_API_KEY_HERE",
  "baseUrl": "https://api.cloudflare.com/client/v4",
  "endpoints": {
    "auth": "https://wexside.ru/api/auth",
    "products": "https://wexside.ru/api/products",
    "payments": "https://wexside.ru/api/payments",
    "users": "https://wexside.ru/api/users",
    "cabinet": "https://wexside.ru/api/cabinet",
    "cfProxy": "YOUR_CLOUDFLARE_WORKER_URL",
    "cfAuth": "https://api.cloudflare.com/client/v4/user/tokens/verify",
    "cfZones": "https://api.cloudflare.com/client/v4/zones"
  },
  "headers": {
    "Authorization": "Bearer YOUR_CLOUDFLARE_API_KEY_HERE",
    "Content-Type": "application/json",
    "User-Agent": "Wexside-Client-Local/1.0.0"
  },
  "settings": {
    "useProxy": true,
    "fallbackToOriginal": true,
    "cacheResponses": true,
    "timeout": 10000
  }
};

class WexsideApiClient {
  constructor(config = CF_API_CONFIG) {
    this.config = config;
    this.cache = new Map();
    this.requestId = 0;
  }

  // Основной метод для запросов
  async request(endpoint, options = {}) {
    const requestId = ++this.requestId;
    const startTime = Date.now();
    
    console.log(`[API-${requestId}] 📡 Запрос: ${endpoint}`);
    
    try {
      // Проверяем кэш
      const cacheKey = endpoint + JSON.stringify(options);
      if (this.config.settings.cacheResponses && this.cache.has(cacheKey)) {
        console.log(`[API-${requestId}] 💾 Использую кэш`);
        return this.cache.get(cacheKey);
      }

      // Подготавливаем URL
      let url = endpoint;
      if (this.config.settings.useProxy && this.config.endpoints.cfProxy !== 'YOUR_CLOUDFLARE_WORKER_URL') {
        // Используем Cloudflare Workers как прокси
        url = `${this.config.endpoints.cfProxy}/proxy?url=${encodeURIComponent(endpoint)}`;
      }

      // Подготавливаем заголовки
      const headers = {
        ...this.config.headers,
        ...options.headers
      };

      // Выполняем запрос
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: AbortSignal.timeout(this.config.settings.timeout)
      });

      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        console.error(`[API-${requestId}] ❌ Ошибка: ${response.status} (${responseTime}ms)`);
        
        // Пробуем оригинальный API если включен fallback
        if (this.config.settings.fallbackToOriginal && url !== endpoint) {
          console.log(`[API-${requestId}] 🔄 Пробую оригинальный API`);
          return this.request(endpoint, { ...options, useProxy: false });
        }
        
        throw new Error(`API ошибка: ${response.status}`);
      }

      const data = await response.json();
      console.log(`[API-${requestId}] ✅ Успешно: ${responseTime}ms`);

      // Сохраняем в кэш
      if (this.config.settings.cacheResponses) {
        this.cache.set(cacheKey, data);
      }

      return data;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error(`[API-${requestId}] 💥 Критическая ошибка: ${error.message} (${responseTime}ms)`);
      
      // Возвращаем заглушку для разработки
      return this.getFallbackData(endpoint, options);
    }
  }

  // Заглушки для разработки
  getFallbackData(endpoint, options) {
    console.log(`[API] 🏗️ Использую заглушку для: ${endpoint}`);
    
    const fallbacks = {
      'auth': {
        success: true,
        user: {
          id: 1,
          username: 'demo_user',
          email: 'demo@wexside.ru',
          balance: 1000,
          premium: true
        },
        token: 'demo_token_' + Date.now()
      },
      'products': {
        success: true,
        products: [
          {
            id: 1,
            name: 'Wexside для Minecraft',
            price: 499,
            currency: 'RUB',
            description: 'Лучший клиент для Minecraft',
            features: ['Анти-чит', 'Оптимизация', 'Поддержка 24/7']
          },
          {
            id: 2,
            name: 'Wexside для CS2',
            price: 799,
            currency: 'RUB',
            description: 'Профессиональный клиент для CS2',
            features: ['Wallhack', 'Aimbot', 'ESP']
          },
          {
            id: 3,
            name: 'Wexside для Fortnite',
            price: 699,
            currency: 'RUB',
            description: 'Мощный клиент для Fortnite',
            features: ['Aimbot', 'ESP', 'No Recoil']
          }
        ]
      },
      'cabinet': {
        success: true,
        user: {
          id: 1,
          username: 'demo_user',
          balance: 1500,
          purchases: 3,
          lastLogin: new Date().toISOString()
        },
        stats: {
          totalSpent: 1997,
          activeProducts: 2,
          referrals: 5
        }
      },
      'payments': {
        success: true,
        methods: ['Visa', 'MasterCard', 'Qiwi', 'YooMoney', 'Crypto'],
        currencies: ['RUB', 'USD', 'EUR']
      }
    };

    // Ищем подходящую заглушку
    for (const [key, data] of Object.entries(fallbacks)) {
      if (endpoint.includes(key)) {
        return data;
      }
    }

    // Заглушка по умолчанию
    return {
      success: true,
      message: 'Демо данные - API не доступен',
      endpoint,
      timestamp: new Date().toISOString()
    };
  }

  // Специфичные методы API
  async login(email, password) {
    return this.request(this.config.endpoints.auth, {
      method: 'POST',
      body: { email, password }
    });
  }

  async getProducts() {
    return this.request(this.config.endpoints.products);
  }

  async getUserCabinet(userId) {
    return this.request(`${this.config.endpoints.cabinet}/${userId}`);
  }

  async createPayment(productId, method) {
    return this.request(this.config.endpoints.payments, {
      method: 'POST',
      body: { productId, method }
    });
  }

  // Методы для Cloudflare Workers
  async verifyCfToken() {
    return this.request(this.config.endpoints.cfAuth);
  }

  async getCfZones() {
    return this.request(this.config.endpoints.cfZones);
  }
}

// Создаем глобальный экземпляр
window.wexsideApi = new WexsideApiClient();

// Дебаг функции
window.wexsideDebug = {
  testApi: async function() {
    console.log('🧪 ТЕСТИРОВАНИЕ API WEXSIDE');
    console.log('===========================');
    
    try {
      // Тест 1: Проверка конфигурации
      console.log('1. Проверка конфигурации...');
      console.log('   API ключ:', CF_API_CONFIG.apiKey ? '✅ Установлен' : '❌ Отсутствует');
      console.log('   Cloudflare Proxy:', CF_API_CONFIG.endpoints.cfProxy !== 'YOUR_CLOUDFLARE_WORKER_URL' ? '✅ Настроен' : '⚠️  Требуется настройка');
      
      // Тест 2: Получение продуктов
      console.log('2. Тест получения продуктов...');
      const products = await window.wexsideApi.getProducts();
      console.log('   Статус:', products.success ? '✅ Успешно' : '❌ Ошибка');
      console.log('   Количество продуктов:', products.products?.length || 0);
      
      // Тест 3: Демо авторизация
      console.log('3. Тест демо авторизации...');
      const auth = await window.wexsideApi.login('demo@wexside.ru', 'demo123');
      console.log('   Статус:', auth.success ? '✅ Успешно' : '❌ Ошибка');
      console.log('   Пользователь:', auth.user?.username || 'Не найден');
      
      console.log('===========================');
      console.log('✅ ТЕСТИРОВАНИЕ ЗАВЕРШЕНО');
      
      return { products, auth };
      
    } catch (error) {
      console.error('❌ Ошибка тестирования:', error.message);
      return { error: error.message };
    }
  },
  
  clearCache: function() {
    window.wexsideApi.cache.clear();
    console.log('🗑️ Кэш API очищен');
  },
  
  showConfig: function() {
    console.log('⚙️ Конфигурация API:', CF_API_CONFIG);
  }
};

console.log('🚀 Wexside API Client загружен');
console.log('💡 Используйте window.wexsideApi для работы с API');
console.log('💡 Используйте window.wexsideDebug.testApi() для тестирования');