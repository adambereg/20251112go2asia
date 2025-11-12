# Rate Limiting Rules

**Версия:** 1.0  
**Дата:** 2025-11-09

---

## Cloudflare Rate Limiting Rules

### Настройка через Cloudflare Dashboard

1. **Cloudflare Dashboard** → Security → WAF → Rate limiting rules
2. Создать правила согласно матрице ниже

### JSON экспорт правил

```json
{
  "rules": [
    {
      "name": "Public GET Rate Limit",
      "description": "100 requests per minute per IP for public GET endpoints",
      "match": {
        "request": {
          "methods": ["GET"],
          "schemes": ["HTTPS"],
          "url": {
            "host": ["api.go2asia.space"],
            "path": [
              "/v1/api/content/countries",
              "/v1/api/content/cities",
              "/v1/api/content/places",
              "/v1/api/content/events",
              "/v1/api/content/articles"
            ]
          }
        }
      },
      "action": {
        "mode": "simulate",
        "timeout": 60,
        "response": {
          "status_code": 429,
          "content": "{\"error\":{\"code\":\"RATE_LIMIT_EXCEEDED\",\"message\":\"Rate limit exceeded. Try again later.\"}}",
          "content_type": "application/json"
        }
      },
      "ratelimit": {
        "threshold": 100,
        "period": 60
      }
    },
    {
      "name": "Authenticated GET Rate Limit",
      "description": "200 requests per minute per User ID for authenticated GET",
      "match": {
        "request": {
          "methods": ["GET"],
          "schemes": ["HTTPS"],
          "url": {
            "host": ["api.go2asia.space"],
            "path": [
              "/v1/api/token/balance",
              "/v1/api/token/transactions",
              "/v1/api/referral/stats",
              "/v1/api/referral/tree"
            ]
          },
          "headers": {
            "authorization": {
              "op": "ne",
              "value": ""
            }
          }
        }
      },
      "action": {
        "mode": "simulate",
        "timeout": 60,
        "response": {
          "status_code": 429,
          "content": "{\"error\":{\"code\":\"RATE_LIMIT_EXCEEDED\",\"message\":\"Rate limit exceeded. Try again later.\"}}",
          "content_type": "application/json"
        }
      },
      "ratelimit": {
        "threshold": 200,
        "period": 60,
        "counting_expression": "cf.zone.id + http.request.headers[\"authorization\"]"
      }
    },
    {
      "name": "Token Add Rate Limit",
      "description": "10 requests per minute per User ID for adding points",
      "match": {
        "request": {
          "methods": ["POST"],
          "schemes": ["HTTPS"],
          "url": {
            "host": ["api.go2asia.space"],
            "path": ["/v1/api/token/balance/add"]
          }
        }
      },
      "action": {
        "mode": "simulate",
        "timeout": 60,
        "response": {
          "status_code": 429,
          "content": "{\"error\":{\"code\":\"RATE_LIMIT_EXCEEDED\",\"message\":\"Rate limit exceeded. Try again later.\"}}",
          "content_type": "application/json"
        }
      },
      "ratelimit": {
        "threshold": 10,
        "period": 60,
        "counting_expression": "cf.zone.id + http.request.headers[\"authorization\"]"
      }
    },
    {
      "name": "Referral Register Rate Limit",
      "description": "5 requests per hour per User ID for referral registration",
      "match": {
        "request": {
          "methods": ["POST"],
          "schemes": ["HTTPS"],
          "url": {
            "host": ["api.go2asia.space"],
            "path": ["/v1/api/referral/register"]
          }
        }
      },
      "action": {
        "mode": "simulate",
        "timeout": 3600,
        "response": {
          "status_code": 429,
          "content": "{\"error\":{\"code\":\"RATE_LIMIT_EXCEEDED\",\"message\":\"Rate limit exceeded. Try again later.\"}}",
          "content_type": "application/json"
        }
      },
      "ratelimit": {
        "threshold": 5,
        "period": 3600,
        "counting_expression": "cf.zone.id + http.request.headers[\"authorization\"]"
      }
    },
    {
      "name": "Clerk Webhook Rate Limit",
      "description": "100 requests per minute per IP for Clerk webhooks",
      "match": {
        "request": {
          "methods": ["POST"],
          "schemes": ["HTTPS"],
          "url": {
            "host": ["api.go2asia.space"],
            "path": ["/v1/api/auth/webhook"]
          },
          "headers": {
            "svix-id": {
              "op": "ne",
              "value": ""
            }
          }
        }
      },
      "action": {
        "mode": "simulate",
        "timeout": 60,
        "response": {
          "status_code": 429,
          "content": "{\"error\":{\"code\":\"RATE_LIMIT_EXCEEDED\",\"message\":\"Rate limit exceeded. Try again later.\"}}",
          "content_type": "application/json"
        }
      },
      "ratelimit": {
        "threshold": 100,
        "period": 60
      }
    }
  ]
}
```

---

## Anti-Abuse эвристики в сервисах

### Token Service

```typescript
// services/token-service/src/middleware/antiAbuse.ts
import { Context } from 'hono';

export async function checkAntiAbuse(
  userId: string,
  amount: number,
  reason: string
): Promise<{ allowed: boolean; error?: string }> {
  // Velocity limit: максимум 1000 поинтов в час
  const hourlyTotal = await getHourlyTotal(userId);
  if (hourlyTotal + amount > 1000) {
    return {
      allowed: false,
      error: 'Hourly limit exceeded (1000 points)',
    };
  }
  
  // Sanity check: максимум 100 поинтов за одно действие
  if (amount > 100) {
    return {
      allowed: false,
      error: 'Amount too large (max 100 points per action)',
    };
  }
  
  // Проверка на автоматизацию: слишком быстрые запросы
  const lastRequest = await getLastRequestTime(userId);
  if (Date.now() - lastRequest < 1000) {
    return {
      allowed: false,
      error: 'Too many requests (minimum 1 second between requests)',
    };
  }
  
  // Проверка на подозрительные паттерны
  const recentTransactions = await getRecentTransactions(userId, '1h');
  if (recentTransactions.length > 50) {
    // Флаг для ручной проверки
    await flagForReview(userId, 'Too many transactions in 1 hour');
  }
  
  return { allowed: true };
}
```

### Referral Service

```typescript
// services/referral-service/src/middleware/antiAbuse.ts
export async function checkReferralAntiAbuse(
  code: string,
  userId: string,
  ip: string
): Promise<{ allowed: boolean; error?: string }> {
  // Velocity limit: максимум 5 регистраций по одному коду в час
  const recentRegistrations = await getRecentRegistrationsByCode(code, '1h');
  if (recentRegistrations.length >= 5) {
    return {
      allowed: false,
      error: 'Rate limit exceeded (5 registrations per code per hour)',
    };
  }
  
  // Проверка на дубликаты IP
  const existingByIP = await getRegistrationsByIP(ip, '24h');
  if (existingByIP.length >= 3) {
    return {
      allowed: false,
      error: 'CAPTCHA required (too many registrations from this IP)',
    };
  }
  
  // Проверка на подозрительные паттерны
  const sameEmailDomain = await checkSameEmailDomain(code, '24h');
  if (sameEmailDomain.length >= 10) {
    await flagForReview(code, 'Suspicious pattern: same email domain');
  }
  
  return { allowed: true };
}
```

---

## Мониторинг rate limiting

### Метрики для отслеживания

- Количество заблокированных запросов (429)
- Топ IP адресов по количеству блокировок
- Топ User ID по количеству блокировок
- Распределение блокировок по endpoints

### Алерты

- Всплеск 429 ошибок (>10% от всех запросов)
- Подозрительная активность (много блокировок от одного IP/User)

---

**Последнее обновление:** 2025-11-09

