import { Hono } from 'hono';
import { generateRequestId, logRequest, logError, logWarn } from '@go2asia/logger';
import { checkDatabaseConnection } from './utils/db';

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
    service: 'content-service',
  });
});

// Ready check
app.get('/ready', async (c) => {
  const requestId = (c.get('requestId' as keyof Variables) as string | undefined) ?? generateRequestId();
  try {
    const dbConnected = await checkDatabaseConnection(c.env as { DATABASE_URL?: string } | undefined);
    if (!dbConnected) {
      logWarn(requestId, 'Database connection failed', { endpoint: 'ready' });
      return c.json(
        {
          status: 'not ready',
          error: 'Database connection failed',
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

// API routes
import { contentRouter } from './routes/content';
app.route('/v1', contentRouter);

app.get('/', (c) => {
  return c.json({
    message: 'Go2Asia Content Service',
    version: '0.1.0',
  });
});

export default app;

