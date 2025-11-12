# Стратегия кеширования API Gateway

**Дата:** 2025-11-05  
**Статус:** Актуально для MVP фазы

---

## Текущая конфигурация (MVP фаза)

### ✅ Cloudflare Cache Rules: "Bypass cache for API"

**Правило:** Полное отключение кеширования для API Gateway

**Конфигурация:**
- **Имя правила:** `Bypass cache for API`
- **Условия:**
  - Field: `Hostname`
  - Operator: `equals`
  - Value: `api.go2asia.space`
- **Действие:** `Bypass cache`
- **Статус:** ✅ Enabled

**Результат:**
- ✅ Все запросы к `https://api.go2asia.space/v1/api/*` обходят кеш Cloudflare
- ✅ Данные из Neon DB подгружаются в реальном времени
- ✅ Проблема с отображением моковых данных при первой загрузке решена

---

## Причина отключения кеша

На ранних этапах разработки (MVP-фаза) критично видеть актуальные данные сразу после:
- Деплоя изменений в сервисы
- Изменения seed-данных в БД
- Исправления ошибок в API

**Проблема:**
- Cloudflare по умолчанию кешировал ответы API Gateway через edge-cache
- Фронтенд при первом заходе получал устаревшие или моковые данные
- Это приводило к несоответствию между состоянием БД и интерфейсом

**Решение:**
Полное отключение кеширования на уровне Cloudflare Cache Rules позволяет:
- Видеть актуальные данные сразу после изменений
- Быстро отлаживать проблемы с данными
- Упростить разработку и тестирование

---

## План на будущее (Post-MVP)

После стабилизации API и наполнения БД будет возвращено **частичное кеширование**:

### Публичные эндпоинты (кеширование включено)

**Эндпоинты:**
- `GET /v1/api/content/countries`
- `GET /v1/api/content/cities`
- `GET /v1/api/content/places`
- `GET /v1/api/content/events`
- `GET /v1/api/content/articles`

**Конфигурация:**
- **TTL:** 300 секунд (5 минут)
- **Заголовки:**
  ```
  Cache-Control: public, s-maxage=300, stale-while-revalidate=60
  Vary: Accept, Accept-Encoding
  ```

**Примечание:** Эти заголовки уже настроены в `services/api-gateway/src/utils/proxy.ts`, но сейчас переопределяются правилом Cloudflare.

### Приватные эндпоинты (кеширование отключено)

**Эндпоинты:**
- `GET /v1/api/token/balance`
- `GET /v1/api/token/transactions`
- `GET /v1/api/referral/stats`
- `GET /v1/api/referral/tree`
- `POST /v1/api/token/balance/add`
- `POST /v1/api/token/balance/subtract`
- Все эндпоинты `/v1/api/auth/*`

**Конфигурация:**
- **Заголовки:**
  ```
  Cache-Control: no-store, no-cache, must-revalidate
  Pragma: no-cache
  Expires: 0
  ```

**Причина:** Эти данные персональные и должны быть актуальными в реальном времени.

---

## Как вернуть частичное кеширование

### Вариант 1: Обновить Cloudflare Cache Rules

1. Откройте **Cloudflare Dashboard** → **Rules** → **Cache Rules**
2. Найдите правило "Bypass cache for API"
3. Измените условие или создайте новое правило:
   - **Условие:** `URI Path` `starts with` `/v1/api/content/`
   - **Действие:** `Set cache level` → `Standard`
   - **TTL:** `300 seconds`

### Вариант 2: Использовать Cache-Control заголовки

Текущая реализация в `services/api-gateway/src/utils/proxy.ts` уже настроена правильно. После удаления правила Cloudflare Cache Rules заголовки из кода будут работать автоматически.

**Код (уже реализован):**
```typescript
// services/api-gateway/src/utils/proxy.ts
if (isPublicGet && response.status === 200) {
  response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
  response.headers.set('Vary', 'Accept, Accept-Encoding');
}
```

### Вариант 3: Комбинированный подход

Создать два правила Cloudflare:
1. **Правило для публичных эндпоинтов:**
   - Условие: `URI Path` `matches` `/v1/api/content/*`
   - Действие: `Set cache level` → `Standard` + `Edge TTL: 300s`

2. **Правило для приватных эндпоинтов:**
   - Условие: `URI Path` `matches` `/v1/api/(token|referral|auth)/*`
   - Действие: `Bypass cache`

---

## Рекомендации

### Для MVP фазы ✅
- ✅ **Оставить кеш отключенным** — это упрощает разработку и отладку
- ✅ **Сосредоточиться на стабильности API** и корректности данных

### Для Production (после MVP)
- ⏳ Включить кеширование для публичных эндпоинтов (TTL 300s)
- ⏳ Добавить мониторинг hit/miss ratio кеша
- ⏳ Настроить инвалидацию кеша при изменении данных через API

### Метрики для мониторинга
- Cache hit ratio (цель: >80% для публичных эндпоинтов)
- Response time (должен улучшиться с кешированием)
- Error rate (не должна увеличиваться)

---

## Связанные документы

- `docs/planning/DEMO_READINESS_CHECKLIST.md` - чек-лист демо-готовности
- `services/api-gateway/src/utils/proxy.ts` - реализация кеширования в коде
- `docs/planning/services-deployment-guide.md` - руководство по деплою

---

**Последнее обновление:** 2025-11-05  
**Следующий пересмотр:** После завершения MVP фазы


















