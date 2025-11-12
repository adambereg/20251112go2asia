# Кэш-матрица API Gateway

**Дата:** 2025-11-12  
**Статус:** Актуально для Фазы 0

---

## Обзор

Данный документ определяет стратегию кэширования для всех endpoints API Gateway Go2Asia.

### Принципы кэширования

1. **Публичные GET** — кэшируются на CDN (Cloudflare Edge)
2. **Приватные endpoints** — никогда не кэшируются (`no-store`)
3. **POST/PUT/PATCH/DELETE** — никогда не кэшируются
4. **Stale-While-Revalidate** — используется для плавного обновления кэша

---

## Матрица TTL и инвалидации

| Endpoint | Тип | Метод | Cache-Control | TTL (s-maxage) | SWR | Инвалидация | Примечание |
|----------|-----|-------|----------------|----------------|-----|-------------|------------|
| `/v1/api/content/countries` | Публичный | GET | `public, s-maxage=300, stale-while-revalidate=60` | 300s (5 мин) | 60s | При изменении через API | Редко меняется |
| `/v1/api/content/countries/:id` | Публичный | GET | `public, s-maxage=300, stale-while-revalidate=60` | 300s (5 мин) | 60s | При изменении через API | Редко меняется |
| `/v1/api/content/cities` | Публичный | GET | `public, s-maxage=300, stale-while-revalidate=60` | 300s (5 мин) | 60s | При изменении через API | Редко меняется |
| `/v1/api/content/cities/:id` | Публичный | GET | `public, s-maxage=300, stale-while-revalidate=60` | 300s (5 мин) | 60s | При изменении через API | Редко меняется |
| `/v1/api/content/places` | Публичный | GET | `public, s-maxage=300, stale-while-revalidate=60` | 300s (5 мин) | 60s | При изменении через API | Может меняться чаще |
| `/v1/api/content/places/:id` | Публичный | GET | `public, s-maxage=300, stale-while-revalidate=60` | 300s (5 мин) | 60s | При изменении через API | Может меняться чаще |
| `/v1/api/content/events` | Публичный | GET | `public, s-maxage=120, stale-while-revalidate=30` | 120s (2 мин) | 30s | При изменении через API | Часто меняется |
| `/v1/api/content/events/:id` | Публичный | GET | `public, s-maxage=120, stale-while-revalidate=30` | 120s (2 мин) | 30s | При изменении через API | Часто меняется |
| `/v1/api/content/articles` | Публичный | GET | `public, s-maxage=600, stale-while-revalidate=120` | 600s (10 мин) | 120s | При изменении через API | Редко меняется |
| `/v1/api/content/articles/:id` | Публичный | GET | `public, s-maxage=600, stale-while-revalidate=120` | 600s (10 мин) | 120s | При изменении через API | Редко меняется |
| `/v1/api/token/balance` | Приватный | GET | `no-store, no-cache, must-revalidate` | - | - | - | Персональные данные |
| `/v1/api/token/transactions` | Приватный | GET | `no-store, no-cache, must-revalidate` | - | - | - | Персональные данные |
| `/v1/api/token/points/add` | Приватный | POST | `no-store, no-cache, must-revalidate` | - | - | - | Изменяет состояние |
| `/v1/api/token/points/subtract` | Приватный | POST | `no-store, no-cache, must-revalidate` | - | - | - | Изменяет состояние |
| `/v1/api/referral/stats` | Приватный | GET | `no-store, no-cache, must-revalidate` | - | - | - | Персональные данные |
| `/v1/api/referral/tree` | Приватный | GET | `no-store, no-cache, must-revalidate` | - | - | - | Персональные данные |
| `/v1/api/auth/me` | Приватный | GET | `no-store, no-cache, must-revalidate` | - | - | - | Персональные данные |
| `/health` | Системный | GET | `no-store` | - | - | - | Health check |
| `/ready` | Системный | GET | `no-store` | - | - | - | Readiness check |

---

## Реализация

### Gateway Middleware

Кэширование реализовано через middleware в `apps/api-gateway/src/middleware/cache.ts`:

```typescript
export function cacheMiddleware(isPublic: boolean) {
  return async (c: Context, next: Next) => {
    await next();

    if (isPublic && c.req.method === 'GET') {
      c.header('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
      c.header('Vary', 'Accept, Accept-Encoding');
    } else {
      c.header('Cache-Control', 'no-store, no-cache, must-revalidate');
      c.header('Pragma', 'no-cache');
      c.header('Expires', '0');
    }
  };
}
```

### Применение к маршрутам

```typescript
// Публичные endpoints
app.use('/v1/api/content/*', cacheMiddleware(true));

// Приватные endpoints
app.use('/v1/api/token/*', cacheMiddleware(false));
app.use('/v1/api/referral/*', cacheMiddleware(false));
app.use('/v1/api/auth/*', cacheMiddleware(false));
```

---

## Инвалидация кэша

### Автоматическая инвалидация

При изменении данных через API (POST/PUT/PATCH/DELETE) кэш автоматически инвалидируется через Cloudflare Cache Tags (если настроено).

### Ручная инвалидация

Для ручной инвалидации кэша используйте Cloudflare API:

```bash
# Инвалидация конкретного URL
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://api.go2asia.space/v1/api/content/countries"]}'

# Инвалидация по паттерну
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"prefixes":["https://api.go2asia.space/v1/api/content/countries/"]}'
```

---

## Мониторинг кэша

### Метрики Cloudflare

В Cloudflare Dashboard доступны следующие метрики:

- **Cache Hit Ratio** — процент запросов, обслуженных из кэша
- **Cache Status** — распределение по статусам (hit, miss, expired, etc.)
- **Bandwidth Saved** — экономия трафика благодаря кэшу

### Целевые показатели

- **Cache Hit Ratio** ≥ 80% для публичных GET endpoints
- **Bandwidth Saved** ≥ 70% для публичных GET endpoints

---

## Тестирование

Тесты заголовков кэша находятся в `tests/contracts/headers.test.ts`:

```typescript
test('Public GET endpoints have cache headers', async ({ request }) => {
  const response = await request.get(`${API_URL}/v1/api/content/countries`);
  const cacheControl = response.headers()['cache-control'];
  expect(cacheControl).toContain('public');
  expect(cacheControl).toContain('s-maxage=300');
  expect(cacheControl).toContain('stale-while-revalidate=60');
});

test('Private endpoints have no-store', async ({ request }) => {
  const response = await request.get(`${API_URL}/v1/api/token/balance`);
  const cacheControl = response.headers()['cache-control'];
  expect(cacheControl).toContain('no-store');
});
```

---

## Будущие улучшения

### Cache Tags

Для более точной инвалидации можно использовать Cloudflare Cache Tags:

```typescript
// Добавить заголовок при ответе
c.header('Cache-Tag', 'country,content');

// Инвалидировать по тегу
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  --data '{"tags":["country"]}'
```

### Vary по заголовкам

Для мультиязычности можно добавить Vary по Accept-Language:

```typescript
c.header('Vary', 'Accept, Accept-Encoding, Accept-Language');
```

### Edge Cache Rules

Настроить правила кэширования в Cloudflare Dashboard для более гибкого управления.

---

## Troubleshooting

### Проблема: Кэш не работает

**Решение:**
1. Проверить заголовки ответа (`Cache-Control`)
2. Проверить Cloudflare Cache Rules (не должно быть правил, отключающих кэш)
3. Проверить что запрос идёт через Cloudflare (не напрямую к Worker)

### Проблема: Устаревшие данные в кэше

**Решение:**
1. Проверить TTL (может быть слишком большим)
2. Выполнить ручную инвалидацию через Cloudflare API
3. Уменьшить TTL для часто меняющихся данных

### Проблема: Приватные данные кэшируются

**Решение:**
1. Проверить что middleware применён к правильным маршрутам
2. Проверить что `Cache-Control: no-store` установлен
3. Проверить Cloudflare Cache Rules (не должно быть правил, включающих кэш для приватных endpoints)

