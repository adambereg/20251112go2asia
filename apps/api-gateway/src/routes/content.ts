import { Hono } from 'hono';
import { validateBody } from '../middleware/validation';
import { proxyRequest } from '../utils/proxy';
import { z } from 'zod';

const contentRouter = new Hono();

// URL Content Service
const CONTENT_SERVICE_URL =
  process.env.CONTENT_SERVICE_URL || 'https://content.go2asia.space';

// Пример валидации (будет использоваться для POST запросов)
const createCountrySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
});

// Проксирование к Content Service
contentRouter.get('/countries', async (c) => {
  const queryString = c.req.url.split('?')[1] || '';
  const path = `/v1/countries${queryString ? `?${queryString}` : ''}`;
  const response = await proxyRequest(c, CONTENT_SERVICE_URL, path);
  return response;
});

contentRouter.get('/countries/:id', async (c) => {
  const id = c.req.param('id');
  const path = `/v1/countries/${id}`;
  const response = await proxyRequest(c, CONTENT_SERVICE_URL, path);
  return response;
});

// Пример POST с валидацией
contentRouter.post('/countries', validateBody(createCountrySchema), async (c) => {
  const path = '/v1/countries';
  const response = await proxyRequest(c, CONTENT_SERVICE_URL, path);
  return response;
});

export { contentRouter };
