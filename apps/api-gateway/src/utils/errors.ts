import type { ErrorResponse } from '@go2asia/schemas';

/**
 * Создание единого формата ошибки API
 */
export function createErrorResponse(
  code: string,
  message: string,
  traceId: string,
  key?: string,
  statusCode: number = 500
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
