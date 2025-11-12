import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { generateRequestId } from '@go2asia/logger';
import { rateLimit } from './middleware/rateLimit';
import { cacheMiddleware } from './middleware/cache';
import { createErrorResponse } from './utils/errors';

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

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Go2Asia API Gateway',
    version: '0.1.0',
  });
});

// Error handler
app.onError((err, c) => {
  const requestId = c.get('requestId') || generateRequestId();
  console.error('Error:', err);
  
  return c.json(
    createErrorResponse(
      'INTERNAL_ERROR',
      'An internal error occurred',
      requestId
    ),
    500
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
