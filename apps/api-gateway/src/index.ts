import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { generateRequestId } from '@go2asia/logger';
import { rateLimit } from './middleware/rateLimit';
import { cacheMiddleware } from './middleware/cache';
import { createErrorResponse } from './utils/errors';

const app = new Hono();

// Middleware для трассировки с логированием
app.use('*', async (c, next) => {
  const requestId = c.req.header('X-Request-Id') || generateRequestId();
  c.set('requestId', requestId);
  c.header('X-Request-Id', requestId);
  
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  
  // Логирование запроса
  const { logRequest } = await import('@go2asia/logger');
  logRequest(
    requestId,
    c.req.method,
    c.req.path,
    duration,
    c.res.status,
    {
      userAgent: c.req.header('User-Agent'),
      ip: c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For'),
    }
  );
});

// CORS middleware - разделение по окружениям
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://go2asia.space']
  : process.env.NODE_ENV === 'staging'
  ? ['https://staging.go2asia.space', 'https://*.netlify.app']
  : ['http://localhost:3000', 'https://*.netlify.app'];

app.use(
  '*',
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'Idempotency-Key'],
  })
);

// Logger middleware
app.use('*', honoLogger());

// Health check (без rate limit и кэша)
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'api-gateway',
  });
});

// Ready check (без rate limit и кэша)
app.get('/ready', (c) => {
  return c.json({ status: 'ready' });
});

// Rate limiting для публичных GET
app.use('/v1/api/content/*', rateLimit('public-get'));

// Rate limiting для приватных endpoints
app.use('/v1/api/token/*', rateLimit('private-get'));
app.use('/v1/api/referral/*', rateLimit('private-get'));
app.use('/v1/api/auth/*', rateLimit('private-get'));

// Rate limiting для POST
app.use('*', async (c, next) => {
  if (c.req.method === 'POST' || c.req.method === 'PUT' || c.req.method === 'PATCH') {
    return rateLimit('post')(c, next);
  }
  await next();
});

// Cache middleware для публичных GET
app.use('/v1/api/content/*', cacheMiddleware(true));

// Cache middleware для приватных endpoints (no-store)
app.use('/v1/api/token/*', cacheMiddleware(false));
app.use('/v1/api/referral/*', cacheMiddleware(false));
app.use('/v1/api/auth/*', cacheMiddleware(false));

// API routes
import { contentRouter } from './routes/content';
app.route('/v1/api/content', contentRouter);

// Добавляем X-Version заголовок во все ответы
app.use('*', async (c, next) => {
  await next();
  const gitSha = process.env.GITHUB_SHA || process.env.VERCEL_GIT_COMMIT_SHA || 'unknown';
  c.header('X-Version', gitSha.substring(0, 7)); // Короткий SHA
});

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Go2Asia API Gateway',
    version: '0.1.0',
  });
});

// Error handler
app.onError(async (err, c) => {
  const requestId = c.get('requestId') || generateRequestId();
  const { logError } = await import('@go2asia/logger');
  
  logError(requestId, err, {
    method: c.req.method,
    path: c.req.path,
  });
  
  // Определяем код ошибки на основе типа
  let errorCode = 'INTERNAL_ERROR';
  let statusCode = 500;
  
  if (err instanceof Error) {
    if (err.message.includes('UNAUTHORIZED')) {
      errorCode = 'UNAUTHORIZED';
      statusCode = 401;
    } else if (err.message.includes('FORBIDDEN')) {
      errorCode = 'FORBIDDEN';
      statusCode = 403;
    } else if (err.message.includes('NOT_FOUND')) {
      errorCode = 'NOT_FOUND';
      statusCode = 404;
    }
  }
  
  return c.json(
    createErrorResponse(
      errorCode,
      err instanceof Error ? err.message : 'An internal error occurred',
      requestId
    ),
    statusCode
  );
});

// 404 handler
app.notFound((c) => {
  const requestId = c.get('requestId') || generateRequestId();
  
  return c.json(
    createErrorResponse(
      'NOT_FOUND',
      'Route not found',
      requestId
    ),
    404
  );
});

export default app;
