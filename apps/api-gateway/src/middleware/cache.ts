import { Context, Next } from 'hono';

/**
 * Middleware для установки Cache-Control заголовков
 * @param isPublic - true для публичных endpoints, false для приватных
 */
export function cacheMiddleware(isPublic: boolean) {
  return async (c: Context, next: Next) => {
    await next();

    if (isPublic && c.req.method === 'GET') {
      // Публичные GET - пока отключаем кэш (включим позже согласно матрице)
      c.header('Cache-Control', 'public, max-age=0, s-maxage=0, stale-while-revalidate=0');
      c.header('Vary', 'Accept, Accept-Encoding');
    } else {
      // Приватные endpoints - всегда no-store
      c.header('Cache-Control', 'no-store, no-cache, must-revalidate');
      c.header('Pragma', 'no-cache');
      c.header('Expires', '0');
    }
  };
}
