import { Context, Next } from 'hono';
import { verifyJWT } from '@go2asia/logger';
import { createErrorResponse } from '../utils/errors';

/**
 * Middleware для проверки JWT токена
 */
export function authMiddleware() {
  return async (c: Context, next: Next) => {
    const requestId = c.get('requestId') || 'unknown';
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json(
        createErrorResponse(
          'UNAUTHORIZED',
          'Authentication required',
          requestId
        ),
        401
      );
    }
    
    const token = authHeader.substring(7);
    const jwtSecret = c.env?.JWT_SECRET || process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      return c.json(
        createErrorResponse(
          'INTERNAL_ERROR',
          'JWT secret not configured',
          requestId
        ),
        500
      );
    }
    
    try {
      const payload = await verifyJWT(token, jwtSecret);
      c.set('user', payload);
      await next();
    } catch (error) {
      return c.json(
        createErrorResponse(
          'UNAUTHORIZED',
          'Invalid or expired token',
          requestId
        ),
        401
      );
    }
  };
}

/**
 * Middleware для service-to-service аутентификации
 */
export function serviceAuthMiddleware() {
  return async (c: Context, next: Next) => {
    const requestId = c.get('requestId') || 'unknown';
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json(
        createErrorResponse(
          'UNAUTHORIZED',
          'Service authentication required',
          requestId
        ),
        401
      );
    }
    
    const token = authHeader.substring(7);
    const serviceSecret = c.env?.SERVICE_SECRET || process.env.SERVICE_SECRET;
    
    if (!serviceSecret) {
      return c.json(
        createErrorResponse(
          'INTERNAL_ERROR',
          'Service secret not configured',
          requestId
        ),
        500
      );
    }
    
    try {
      await verifyJWT(token, serviceSecret);
      await next();
    } catch (error) {
      return c.json(
        createErrorResponse(
          'UNAUTHORIZED',
          'Invalid service token',
          requestId
        ),
        401
      );
    }
  };
}

