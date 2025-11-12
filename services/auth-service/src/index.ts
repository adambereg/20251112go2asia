import { Hono } from 'hono';
import { generateRequestId, logRequest, logError } from '@go2asia/logger';
import { checkClerkJWKS } from './utils/clerk';

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
  const requestId = c.get('requestId') || generateRequestId();
  try {
    // Проверяем доступность JWKS от Clerk
    const clerkReady = await checkClerkJWKS();
    if (!clerkReady) {
      return c.json(
        {
          status: 'not ready',
          error: 'Clerk JWKS endpoint unavailable',
        },
        503
      );
    }
    return c.json({ status: 'ready' });
  } catch (error) {
    return c.json(
      {
        status: 'not ready',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      503
    );
  }
});

app.get('/', (c) => {
  return c.json({
    message: 'Go2Asia Auth Service',
    version: '0.1.0',
  });
});

export default app;

