/**
 * Custom fetch instance for SDK
 * Используется Orval для генерации клиента
 */

export const customInstance = async <T>(
  config: RequestInit,
  url: string
): Promise<T> => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space';
  const response = await fetch(`${baseURL}${url}`, {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: {
        code: 'UNKNOWN_ERROR',
        message: response.statusText,
        traceId: response.headers.get('X-Request-Id') || 'unknown',
      },
    }));
    throw error;
  }

  return response.json();
};

