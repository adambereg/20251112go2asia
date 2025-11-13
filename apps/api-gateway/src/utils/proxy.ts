import { Context } from 'hono';
import { generateRequestId } from '@go2asia/logger';

/**
 * Проксирование запроса к внутреннему сервису
 * С таймаутом и retry для безопасных GET запросов
 */
export async function proxyRequest(
  c: Context,
  serviceUrl: string,
  path: string
): Promise<Response> {
  const requestId = c.get('requestId') || generateRequestId();
  const url = `${serviceUrl}${path}`;
  
  // Копируем заголовки запроса
  const headers = new Headers();
  headers.set('X-Request-Id', requestId);
  headers.set('Content-Type', 'application/json');
  
  // Передаём Authorization если есть
  const authHeader = c.req.header('Authorization');
  if (authHeader) {
    headers.set('Authorization', authHeader);
  }
  
  // Копируем другие важные заголовки
  const userAgent = c.req.header('User-Agent');
  if (userAgent) {
    headers.set('User-Agent', userAgent);
  }
  
  const cfIp = c.req.header('CF-Connecting-IP');
  if (cfIp) {
    headers.set('CF-Connecting-IP', cfIp);
  }
  
  const forwardedFor = c.req.header('X-Forwarded-For');
  if (forwardedFor) {
    headers.set('X-Forwarded-For', forwardedFor);
  }
  
  // Получаем тело запроса если есть
  let body: BodyInit | undefined;
  if (c.req.method !== 'GET' && c.req.method !== 'HEAD') {
    try {
      body = await c.req.raw.clone().text();
    } catch {
      // Тело уже прочитано или отсутствует
    }
  }
  
  // Таймаут для прокси-запросов (5-8 секунд)
  const PROXY_TIMEOUT = parseInt(
    (c.env as { PROXY_TIMEOUT?: string } | undefined)?.PROXY_TIMEOUT || '6000',
    10
  );
  
  // Retry только для безопасных GET запросов
  const isSafeGet = c.req.method === 'GET' || c.req.method === 'HEAD';
  const maxRetries = isSafeGet ? 2 : 0; // 1-2 retry для GET
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Джиттер для retry (случайная задержка 0-200ms)
      if (attempt > 0) {
        const jitter = Math.floor(Math.random() * 200);
        await new Promise((resolve) => setTimeout(resolve, jitter));
      }
      
      // Создаём AbortController для таймаута
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), PROXY_TIMEOUT);
      
      // Выполняем запрос к сервису
      const response = await fetch(url, {
        method: c.req.method,
        headers,
        body,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Копируем заголовки ответа (включая rate limit заголовки)
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set('X-Request-Id', requestId);
      
      // Копируем заголовки в контекст Hono
      responseHeaders.forEach((value, key) => {
        c.header(key, value);
      });
      
      // Возвращаем JSON если это JSON ответ
      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        return c.json(data, response.status);
      }
      
      // Иначе возвращаем как есть
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      lastError = error as Error;
      
      // Не retry для небезопасных методов или если это не таймаут/сетевая ошибка
      if (!isSafeGet || attempt === maxRetries) {
        break;
      }
      
      // Retry только для таймаутов и сетевых ошибок
      if (
        error instanceof Error &&
        (error.name === 'AbortError' || error.message.includes('fetch'))
      ) {
        continue; // Retry
      }
      
      break; // Не retry для других ошибок
    }
  }
  
  // Если все retry исчерпаны, возвращаем ошибку
  throw lastError || new Error('Proxy request failed');
}

