/**
 * Утилиты для маскирования PII (Personally Identifiable Information)
 * Email, телефон, токены должны маскироваться перед логированием
 */

/**
 * Маскирует email адрес
 * example@domain.com -> ex****@domain.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return email;
  }
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}****@${domain}`;
  }
  return `${local.substring(0, 2)}****@${domain}`;
}

/**
 * Маскирует телефонный номер
 * +1234567890 -> +12****7890
 */
export function maskPhone(phone: string): string {
  if (!phone) {
    return phone;
  }
  // Удаляем все нецифровые символы кроме +
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.length <= 4) {
    return '****';
  }
  const prefix = cleaned.substring(0, 3);
  const suffix = cleaned.substring(cleaned.length - 4);
  return `${prefix}****${suffix}`;
}

/**
 * Маскирует JWT токен или другой токен
 * Показывает только первые и последние 4 символа
 */
export function maskToken(token: string): string {
  if (!token || token.length <= 8) {
    return '****';
  }
  return `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
}

/**
 * Маскирует все PII в объекте рекурсивно
 */
export function maskPII(obj: unknown): unknown {
  if (typeof obj === 'string') {
    // Проверяем на email
    if (obj.includes('@') && obj.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return maskEmail(obj);
    }
    // Проверяем на телефон
    if (obj.match(/^\+?[\d\s\-()]+$/)) {
      return maskPhone(obj);
    }
    // Проверяем на токен (Bearer token или длинная строка)
    if (obj.length > 20 && (obj.startsWith('Bearer ') || obj.match(/^[A-Za-z0-9_-]+$/))) {
      return maskToken(obj.replace('Bearer ', ''));
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(maskPII);
  }

  if (obj && typeof obj === 'object') {
    const masked: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      // Маскируем известные поля с PII
      if (
        lowerKey.includes('email') ||
        lowerKey.includes('phone') ||
        lowerKey.includes('token') ||
        lowerKey.includes('password') ||
        lowerKey.includes('secret') ||
        lowerKey === 'authorization'
      ) {
        if (typeof value === 'string') {
          if (lowerKey.includes('email')) {
            masked[key] = maskEmail(value);
          } else if (lowerKey.includes('phone')) {
            masked[key] = maskPhone(value);
          } else {
            masked[key] = maskToken(value);
          }
        } else {
          masked[key] = maskPII(value);
        }
      } else {
        masked[key] = maskPII(value);
      }
    }
    return masked;
  }

  return obj;
}

