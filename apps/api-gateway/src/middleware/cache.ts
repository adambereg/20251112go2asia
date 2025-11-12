import { Context, Next } from 'hono';

/**
 * Middleware для установки Cache-Control заголовков
 * Поддерживает разные TTL для разных типов контента
 * @param isPublic - true для публичных endpoints, false для приватных
 * @param ttl - TTL в секундах (по умолчанию 300s)
 * @param staleWhileRevalidate - SWR в секундах (по умолчанию 60s)
 */
export function cacheMiddleware(
  isPublic: boolean,
  ttl: number = 300,
  staleWhileRevalidate: number = 60
) {
  return async (c: Context, next: Next) => {
    await next();

    if (isPublic && c.req.method === 'GET') {
      // Публичные GET запросы - кэшируем на CDN
      c.header('Cache-Control', `public, s-maxage=${ttl}, stale-while-revalidate=${staleWhileRevalidate}`);
      c.header('Vary', 'Accept, Accept-Encoding');
    } else {
      // Приватные endpoints - всегда no-store
      c.header('Cache-Control', 'no-store, no-cache, must-revalidate');
      c.header('Pragma', 'no-cache');
      c.header('Expires', '0');
    }
  };
}

/**
 * Предустановленные конфигурации кэша для разных типов контента
 */
export const cacheConfigs = {
  // Редко меняющийся контент (страны, города, статьи)
  stable: cacheMiddleware(true, 600, 120), // 10 мин TTL, 2 мин SWR
  
  // Средняя частота изменений (места)
  moderate: cacheMiddleware(true, 300, 60), // 5 мин TTL, 1 мин SWR
  
  // Часто меняющийся контент (события)
  dynamic: cacheMiddleware(true, 120, 30), // 2 мин TTL, 30 сек SWR
  
  // Приватные endpoints
  private: cacheMiddleware(false),
};
