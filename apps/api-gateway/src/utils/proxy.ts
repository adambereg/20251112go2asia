import { Context } from 'hono';
import { generateRequestId } from '@go2asia/logger';

/**
 * Проксирование запроса к внутреннему сервису
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
  
  // Выполняем запрос к сервису
  const response = await fetch(url, {
    method: c.req.method,
    headers,
    body,
  });
  
  // Копируем заголовки ответа (включая rate limit заголовки)
  const responseHeaders = new Headers(response.headers);
  responseHeaders.set('X-Request-Id', requestId);
  
  // Возвращаем ответ с заголовками
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

