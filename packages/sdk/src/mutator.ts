/**
 * Custom fetch instance для SDK
 * Добавляет базовый URL, таймаут и обработку ошибок
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10);

export const customInstance = async <T>(
  config: RequestInit & { url: string }
): Promise<T> => {
  const { url, ...requestConfig } = config;
  
  // Создаём AbortController для таймаута
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...requestConfig,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: {
          code: 'HTTP_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`,
          traceId: response.headers.get('X-Request-Id') || 'unknown',
        },
      }));
      throw error;
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw {
        error: {
          code: 'TIMEOUT',
          message: 'Request timeout',
          traceId: 'unknown',
        },
      };
    }
    throw error;
  }
};
