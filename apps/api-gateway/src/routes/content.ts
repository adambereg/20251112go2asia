import { Hono } from 'hono';
import { validateBody } from '../middleware/validation';
import { z } from 'zod';

const contentRouter = new Hono();

// Пример валидации (будет использоваться для POST запросов)
const createCountrySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
});

// Проксирование к Content Service
contentRouter.get('/countries', async (c) => {
  // TODO: Проксировать запрос к Content Service
  return c.json({ items: [] });
});

contentRouter.get('/countries/:id', async (c) => {
  const id = c.req.param('id');
  // TODO: Проксировать запрос к Content Service
  return c.json({ id, name: 'Example Country' });
});

// Пример POST с валидацией
contentRouter.post('/countries', validateBody(createCountrySchema), async (c) => {
  const body = c.get('validatedBody');
  // TODO: Проксировать запрос к Content Service
  return c.json({ id: 'new-id', ...body }, 201);
});

export { contentRouter };
