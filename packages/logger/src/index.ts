/**
 * Единый логгер для всех сервисов Go2Asia
 * Поддерживает requestId для трассировки запросов
 */

export function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback для окружений без crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export interface LogContext {
  [key: string]: unknown;
}

export function logRequest(
  requestId: string,
  method: string,
  path: string,
  duration: number,
  status: number,
  context?: LogContext
): void {
  console.log(
    JSON.stringify({
      level: 'info',
      requestId,
      method,
      path,
      duration,
      status,
      timestamp: new Date().toISOString(),
      ...context,
    })
  );
}

export function logError(
  requestId: string,
  error: Error,
  context?: LogContext
): void {
  console.error(
    JSON.stringify({
      level: 'error',
      requestId,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      timestamp: new Date().toISOString(),
      ...context,
    })
  );
}

export function logInfo(
  requestId: string,
  message: string,
  context?: LogContext
): void {
  console.log(
    JSON.stringify({
      level: 'info',
      requestId,
      message,
      timestamp: new Date().toISOString(),
      ...context,
    })
  );
}

export function logWarn(
  requestId: string,
  message: string,
  context?: LogContext
): void {
  console.warn(
    JSON.stringify({
      level: 'warn',
      requestId,
      message,
      timestamp: new Date().toISOString(),
      ...context,
    })
  );
}
