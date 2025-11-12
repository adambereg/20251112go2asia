import { Hono } from 'hono';
import { generateRequestId, logRequest, logError } from '@go2asia/logger';

const app = new Hono();

// Middleware для трассировки с логированием
app.use('*', async (c, next) => {
  const requestId = c.req.header('X-Request-Id') || generateRequestId();
  c.set('requestId', requestId);
  c.header('X-Request-Id', requestId);
  
  const start = Date.now();
  try {
    await next();
  } catch (error) {
    logError(requestId, error as Error, {
      method: c.req.method,
      path: c.req.path,
    });
    throw error;
  } finally {
    const duration = Date.now() - start;
    logRequest(
      requestId,
      c.req.method,
      c.req.path,
      duration,
      c.res.status
    );
  }
});

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'auth-service',
  });
});

// Ready check
app.get('/ready', async (c) => {
  // Auth Service может не иметь БД (использует Clerk)
  // Проверяем только базовую готовность
  return c.json({ status: 'ready' });
});

app.get('/', (c) => {
  return c.json({
    message: 'Go2Asia Auth Service',
    version: '0.1.0',
  });
});

export default app;

