import { Context, Next } from 'hono';
import { z } from 'zod';
import { createErrorResponse } from '../utils/errors';

/**
 * Middleware для валидации тела запроса через Zod
 */
export function validateBody<T extends z.ZodType>(schema: T) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const validated = schema.parse(body);
      c.set('validatedBody', validated);
      await next();
    } catch (error) {
      const requestId = c.get('requestId') || 'unknown';
      
      if (error instanceof z.ZodError) {
        return c.json(
          createErrorResponse(
            'VALIDATION_ERROR',
            'Invalid request parameters',
            requestId,
            error.errors[0]?.path[0]?.toString()
          ),
          400
        );
      }
      
      return c.json(
        createErrorResponse(
          'BAD_REQUEST',
          'Invalid request body',
          requestId
        ),
        400
      );
    }
  };
}
