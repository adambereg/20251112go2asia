import { Hono } from 'hono';
import { generateRequestId, logRequest, logError, logWarn } from '@go2asia/logger';
import { checkClerkJWKS } from './utils/clerk';

type Variables = {
  requestId: string;
};

const app = new Hono<{ Variables: Variables }>();

// Middleware для трассировки с логированием
app.use('*', async (c, next) => {
  const requestId = c.req.header('X-Request-Id') || generateRequestId();
  c.set('requestId' as keyof Variables, requestId);
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
  const requestId = (c.get('requestId' as keyof Variables) as string | undefined) ?? generateRequestId();
  try {
    // Проверяем доступность JWKS от Clerk
    // В Cloudflare Workers env доступен через c.env, но для совместимости передаём undefined
    // Переменные окружения будут доступны через wrangler.toml vars или через секреты
    const clerkReady = await checkClerkJWKS(c.env as { CLERK_JWKS_URL?: string; CLERK_DOMAIN?: string } | undefined);
    if (!clerkReady) {
      logWarn(requestId, 'Clerk JWKS endpoint unavailable', { endpoint: 'ready' });
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
    logError(requestId, error instanceof Error ? error : new Error('Unknown error'), { endpoint: 'ready' });
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

