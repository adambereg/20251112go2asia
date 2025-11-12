/**
 * Утилиты для проверки внешних зависимостей Auth Service
 * Проверка доступности JWKS от Clerk
 */

/**
 * Проверка доступности JWKS endpoint от Clerk
 */
export async function checkClerkJWKS(): Promise<boolean> {
  const clerkJWKSUrl =
    process.env.CLERK_JWKS_URL ||
    `https://${process.env.CLERK_DOMAIN || 'clerk.go2asia.space'}/.well-known/jwks.json`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 секунд таймаут

    const response = await fetch(clerkJWKSUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Go2Asia-Auth-Service/0.1.0',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return false;
    }

    // Проверяем что это валидный JWKS
    const data = await response.json();
    return Array.isArray(data.keys) && data.keys.length > 0;
  } catch (error) {
    console.error('Clerk JWKS check failed:', error);
    return false;
  }
}

