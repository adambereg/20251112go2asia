import { Context, Next } from 'hono';

type Variables = {
  requestId: string;
};

// Простой in-memory rate limiter (заглушка)
// В production будет заменён на Cloudflare Rate Limiting Rules

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

// Конфигурация лимитов
const LIMITS = {
  'public-get': { max: 100, window: 60 * 1000 }, // 100 req/min
  'private-get': { max: 200, window: 60 * 1000 }, // 200 req/min
  'post': { max: 10, window: 60 * 1000 }, // 10 req/min
};

function getKey(c: Context, type: string): string {
  // Для приватных - по User ID из JWT (если есть)
  // Для публичных - по IP
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
  return `${type}:${ip}`;
}

export function rateLimit(type: keyof typeof LIMITS) {
  return async (c: Context<{ Variables: Variables }>, next: Next) => {
    const limit = LIMITS[type];
    const key = getKey(c, type);
    const now = Date.now();

    // Очистка устаревших записей
    if (store[key] && store[key].resetAt < now) {
      delete store[key];
    }

    // Инициализация или получение текущего счётчика
    if (!store[key]) {
      store[key] = { count: 0, resetAt: now + limit.window };
    }

    // Установка заголовков (всегда, даже при превышении лимита)
    c.header('X-RateLimit-Limit', limit.max.toString());
    
    // Проверка лимита
    if (store[key].count >= limit.max) {
      const requestId = (c.get('requestId' as keyof Variables) as string | undefined) || 'unknown';
      // Заголовки при превышении лимита
      c.header('X-RateLimit-Remaining', '0');
      c.header('X-RateLimit-Reset', new Date(store[key].resetAt).toISOString());
      
      return c.json(
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Rate limit exceeded. Try again later.',
            traceId: requestId,
          },
        },
        429
      );
    }

    // Увеличение счётчика
    store[key].count++;

    // Заголовки при успешном запросе
    c.header('X-RateLimit-Remaining', Math.max(0, limit.max - store[key].count).toString());
    c.header('X-RateLimit-Reset', new Date(store[key].resetAt).toISOString());

    return next();
  };
}
