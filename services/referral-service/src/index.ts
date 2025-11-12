import { Hono } from 'hono';
import { generateRequestId } from '@go2asia/logger';

const app = new Hono();

// Middleware для трассировки
app.use('*', async (c, next) => {
  const requestId = c.req.header('X-Request-Id') || generateRequestId();
  c.set('requestId', requestId);
  c.header('X-Request-Id', requestId);
  await next();
});

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'referral-service',
  });
});

// Ready check
app.get('/ready', async (c) => {
  // TODO: Проверка подключения к БД
  return c.json({ status: 'ready' });
});

app.get('/', (c) => {
  return c.json({
    message: 'Go2Asia Referral Service',
    version: '0.1.0',
  });
});

export default app;

