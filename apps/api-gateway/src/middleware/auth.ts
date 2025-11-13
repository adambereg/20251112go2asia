import { Context, Next } from 'hono';
import { verifyJWT } from '@go2asia/logger';
import { createErrorResponse } from '../utils/errors';

type Variables = {
  requestId: string;
  user?: unknown;
};

/**
 * Middleware для проверки JWT токена
 */
export function authMiddleware() {
  return async (c: Context<{ Variables: Variables }>, next: Next) => {
    const requestId = (c.get('requestId' as keyof Variables) as string | undefined) || 'unknown';
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
    const jwtSecret = (c.env as { JWT_SECRET?: string } | undefined)?.JWT_SECRET;
    
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
      return next();
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
 * Строгая проверка: iss=gateway, aud=<service>, kid, exp/nbf
 */
export function serviceAuthMiddleware(expectedAudience?: string) {
  return async (c: Context<{ Variables: Variables }>, next: Next) => {
    const requestId = (c.get('requestId' as keyof Variables) as string | undefined) || 'unknown';
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
    const serviceSecret = (c.env as { SERVICE_SECRET?: string } | undefined)?.SERVICE_SECRET;
    
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
      const payload = await verifyJWT(token, serviceSecret);
      
      // Проверка iss (issuer) - должен быть gateway
      if (payload.iss !== 'gateway') {
        return c.json(
          createErrorResponse(
            'UNAUTHORIZED',
            'Invalid token issuer',
            requestId
          ),
          401
        );
      }
      
      // Проверка aud (audience) - должен соответствовать сервису
      if (expectedAudience && payload.aud !== expectedAudience) {
        return c.json(
          createErrorResponse(
            'UNAUTHORIZED',
            'Invalid token audience',
            requestId
          ),
          401
        );
      }
      
      // Проверка kid (key ID) - должен присутствовать для ротации ключей
      if (!payload.kid) {
        return c.json(
          createErrorResponse(
            'UNAUTHORIZED',
            'Token missing key ID',
            requestId
          ),
          401
        );
      }
      
      // Проверка exp (expiration) и nbf (not before) с допуском по времени
      const now = Math.floor(Date.now() / 1000);
      const clockSkew = 60; // 60 секунд допуск на рассинхронизацию часов
      
      const exp = typeof payload.exp === 'number' ? payload.exp : undefined;
      const nbf = typeof payload.nbf === 'number' ? payload.nbf : undefined;
      
      if (exp && exp < now - clockSkew) {
        return c.json(
          createErrorResponse(
            'UNAUTHORIZED',
            'Token expired',
            requestId
          ),
          401
        );
      }
      
      if (nbf && nbf > now + clockSkew) {
        return c.json(
          createErrorResponse(
            'UNAUTHORIZED',
            'Token not yet valid',
            requestId
          ),
          401
        );
      }
      
      return next();
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

