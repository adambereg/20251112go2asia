import { Hono } from 'hono';
import { validateBody } from '../middleware/validation';
import { proxyRequest } from '../utils/proxy';
import { z } from 'zod';

const contentRouter = new Hono();

// URL Content Service
// В Cloudflare Workers переменные окружения доступны через c.env
// Для совместимости используем значение по умолчанию
function getContentServiceUrl(env?: { CONTENT_SERVICE_URL?: string }): string {
  return env?.CONTENT_SERVICE_URL || 'https://content.go2asia.space';
}

// Пример валидации (будет использоваться для POST запросов)
const createCountrySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
});

// Проксирование к Content Service
contentRouter.get('/countries', async (c) => {
  const CONTENT_SERVICE_URL = getContentServiceUrl(c.env as { CONTENT_SERVICE_URL?: string } | undefined);
  const queryString = c.req.url.split('?')[1] || '';
  const path = `/v1/countries${queryString ? `?${queryString}` : ''}`;
  const response = await proxyRequest(c, CONTENT_SERVICE_URL, path);
  return response;
});

contentRouter.get('/countries/:id', async (c) => {
  const CONTENT_SERVICE_URL = getContentServiceUrl(c.env as { CONTENT_SERVICE_URL?: string } | undefined);
  const id = c.req.param('id');
  const path = `/v1/countries/${id}`;
  const response = await proxyRequest(c, CONTENT_SERVICE_URL, path);
  return response;
});

contentRouter.get('/cities', async (c) => {
  const CONTENT_SERVICE_URL = getContentServiceUrl(c.env as { CONTENT_SERVICE_URL?: string } | undefined);
  const queryString = c.req.url.split('?')[1] || '';
  const path = `/v1/cities${queryString ? `?${queryString}` : ''}`;
  const response = await proxyRequest(c, CONTENT_SERVICE_URL, path);
  return response;
});

contentRouter.get('/places', async (c) => {
  const CONTENT_SERVICE_URL = getContentServiceUrl(c.env as { CONTENT_SERVICE_URL?: string } | undefined);
  const queryString = c.req.url.split('?')[1] || '';
  const path = `/v1/places${queryString ? `?${queryString}` : ''}`;
  const response = await proxyRequest(c, CONTENT_SERVICE_URL, path);
  return response;
});

// Пример POST с валидацией
contentRouter.post('/countries', validateBody(createCountrySchema), async (c) => {
  const CONTENT_SERVICE_URL = getContentServiceUrl(c.env as { CONTENT_SERVICE_URL?: string } | undefined);
  const path = '/v1/countries';
  const response = await proxyRequest(c, CONTENT_SERVICE_URL, path);
  return response;
});

export { contentRouter };
