/**
 * @go2asia/schemas
 * 
 * Zod схемы для валидации данных
 */

import { z } from 'zod';

// Базовые схемы будут добавлены позже

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    traceId: z.string(),
    key: z.string().optional(),
  }),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

