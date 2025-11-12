import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { generateRequestId } from '@go2asia/logger';

const app = new Hono();

// Middleware для трассировки
app.use('*', async (c, next) => {
  const requestId = c.req.header('X-Request-Id') || generateRequestId();
  c.set('requestId', requestId);
  c.header('X-Request-Id', requestId);
  await next();
});

// CORS middleware
app.use(
  '*',
  cors({
    origin: [
      'https://go2asia.space',
      'https://*.netlify.app',
      'http://localhost:3000',
    ],
    credentials: true,
  })
);

// Logger middleware
app.use('*', honoLogger());

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'api-gateway',
  });
});

// Ready check
app.get('/ready', (c) => {
  return c.json({ status: 'ready' });
});

// API routes будут добавлены позже
app.get('/', (c) => {
  return c.json({
    message: 'Go2Asia API Gateway',
    version: '0.1.0',
  });
});

export default app;

