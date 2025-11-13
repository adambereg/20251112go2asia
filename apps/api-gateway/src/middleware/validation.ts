import { Context, Next } from 'hono';
import { z } from 'zod';
import { createErrorResponse } from '../utils/errors';

type Variables = {
  requestId: string;
  validatedBody?: unknown;
};

/**
 * Middleware для валидации тела запроса через Zod
 */
export function validateBody<T extends z.ZodType>(schema: T) {
  return async (c: Context<{ Variables: Variables }>, next: Next) => {
    try {
      const body = await c.req.json();
      const validated = schema.parse(body);
      c.set('validatedBody', validated);
      return next();
    } catch (error) {
      const requestId = (c.get('requestId' as keyof Variables) as string | undefined) || 'unknown';
      
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
