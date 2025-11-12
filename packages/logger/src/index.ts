/**
 * Единый логгер для всех сервисов Go2Asia
 * Поддерживает requestId для трассировки запросов
 * Автоматически маскирует PII (email, телефон, токены)
 */

import { maskPII } from './pii';

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
  const logData = {
    level: 'info',
    requestId,
    method,
    path,
    duration,
    status,
    timestamp: new Date().toISOString(),
    ...(context ? maskPII(context) : {}),
  };
  console.log(JSON.stringify(logData));
}

export function logError(
  requestId: string,
  error: Error,
  context?: LogContext
): void {
  const logData = {
    level: 'error',
    requestId,
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    timestamp: new Date().toISOString(),
    ...(context ? maskPII(context) : {}),
  };
  console.error(JSON.stringify(logData));
}

export function logInfo(
  requestId: string,
  message: string,
  context?: LogContext
): void {
  const logData = {
    level: 'info',
    requestId,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? maskPII(context) : {}),
  };
  console.log(JSON.stringify(logData));
}

export function logWarn(
  requestId: string,
  message: string,
  context?: LogContext
): void {
  const logData = {
    level: 'warn',
    requestId,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? maskPII(context) : {}),
  };
  console.warn(JSON.stringify(logData));
}
