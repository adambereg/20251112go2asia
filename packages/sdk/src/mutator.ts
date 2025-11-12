/**
 * Custom fetch instance для SDK
 * Добавляет базовый URL и обработку ошибок
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';

export const customInstance = async <T>(
  config: RequestInit & { url: string }
): Promise<T> => {
  const { url, ...requestConfig } = config;
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...requestConfig,
    headers: {
      'Content-Type': 'application/json',
      ...requestConfig.headers,
    },
  });

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
};
