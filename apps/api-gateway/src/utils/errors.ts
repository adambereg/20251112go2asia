import type { ErrorResponse } from '@go2asia/schemas';

/**
 * Создание единого формата ошибки API
 */
export function createErrorResponse(
  code: string,
  message: string,
  traceId: string,
  key?: string
): ErrorResponse {
  return {
    error: {
      code,
      message,
      traceId,
      ...(key && { key }),
    },
  };
}
