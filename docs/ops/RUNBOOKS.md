# Runbooks для типичных инцидентов

**Версия:** 1.0  
**Дата:** 2025-11-09

---

## P0: Критические инциденты (немедленное реагирование)

### Runbook: Ошибки 5xx в Content Service

**Симптомы:**
- Error rate > 1% в течение 5 минут
- Availability < 99%
- Логи показывают 500 ошибки

**Шаги:**

1. **Проверить логи Cloudflare Workers**
   ```bash
   cd services/content-service
   wrangler tail --env production
   ```

2. **Проверить подключение к Neon DB**
   ```bash
   curl https://api.go2asia.space/v1/api/content/ready
   ```

3. **Проверить метрики БД в Neon Dashboard**
   - Neon Dashboard → Project → Monitoring
   - Проверить connection pool, таймауты, slow queries

4. **Если проблема с БД:**
   - Проверить connection pool (максимум соединений)
   - Проверить таймауты
   - Проверить slow queries
   - При необходимости — увеличить connection pool

5. **Если проблема с кодом:**
   - Проверить последний деплой
   - Проверить изменения в коде
   - Откатить при необходимости:
     ```bash
     wrangler rollback --env production
     ```

6. **Проверить восстановление**
   ```bash
   curl https://api.go2asia.space/v1/api/content/health
   curl https://api.go2asia.space/v1/api/content/ready
   ```

**Время восстановления:** <15 минут

---

### Runbook: Всплеск латентности

**Симптомы:**
- Latency p95 > 1000ms в течение 5 минут
- Пользователи жалуются на медленную работу

**Шаги:**

1. **Проверить дашборд latency по маршрутам**
   - Cloudflare Dashboard → Analytics → Workers
   - Определить проблемный маршрут

2. **Проверить логи для проблемного маршрута**
   ```bash
   wrangler tail --env production | grep "GET /v1/api/content/countries"
   ```

3. **Проверить метрики БД**
   - Neon Dashboard → Monitoring
   - Проверить slow queries
   - Проверить connection pool usage

4. **Проверить Cloudflare Cache hit ratio**
   - Cloudflare Dashboard → Analytics → Cache
   - Если hit ratio низкий — проверить заголовки Cache-Control

5. **Принять меры:**
   - Если проблема с БД — оптимизировать запрос или добавить индекс
   - Если проблема с кешем — увеличить TTL или проверить заголовки
   - Если проблема с кодом — оптимизировать или откатить

**Время восстановления:** <30 минут

---

### Runbook: Ошибки Clerk Webhook

**Симптомы:**
- Error rate webhook > 5% в Clerk Dashboard
- Пользователи не синхронизируются с БД

**Шаги:**

1. **Проверить логи Auth Service**
   ```bash
   cd services/auth-service
   wrangler tail --env production | grep webhook
   ```

2. **Проверить CLERK_WEBHOOK_SECRET**
   - Cloudflare Dashboard → auth-service-production → Variables
   - Сравнить с Clerk Dashboard → Webhooks → Signing Secret

3. **Проверить Clerk Dashboard**
   - Clerk Dashboard → Webhooks → Endpoints
   - Проверить Error Rate
   - Проверить последние события

4. **Проверить передачу заголовков через API Gateway**
   ```bash
   # Проверить логи Gateway
   wrangler tail --env production | grep "svix-"
   ```

5. **Протестировать webhook вручную**
   - Clerk Dashboard → Webhooks → Test endpoint
   - Проверить ответ

6. **Если проблема с секретом:**
   - Обновить CLERK_WEBHOOK_SECRET в Cloudflare
   - Обновить в Clerk Dashboard

**Время восстановления:** <20 минут

---

## P1: Предупреждающие инциденты (реагирование в течение часа)

### Runbook: Error budget исчерпан на 50%

**Симптомы:**
- Error budget использован на 50%
- Метрики показывают рост ошибок

**Шаги:**

1. **Проверить дашборд SLO**
   - Определить, какой сервис исчерпывает budget
   - Проверить тренд ошибок

2. **Проанализировать ошибки**
   - Топ ошибок по типу
   - Топ ошибок по endpoint
   - Топ ошибок по времени

3. **Принять меры:**
   - Исправить частые ошибки
   - Оптимизировать проблемные endpoints
   - Увеличить мониторинг

4. **Уведомить команду**
   - Создать issue в GitHub
   - Обсудить на standup

---

### Runbook: Необычный всплеск трафика

**Симптомы:**
- Трафик >200% от среднего
- Возможна DDoS атака

**Шаги:**

1. **Проверить источник трафика**
   - Cloudflare Dashboard → Analytics → Traffic
   - Проверить топ IP адресов

2. **Проверить паттерны запросов**
   - Одинаковые endpoints
   - Одинаковые IP адреса
   - Подозрительные User-Agent

3. **Принять меры:**
   - Если DDoS — включить Cloudflare DDoS Protection
   - Если легитимный трафик — масштабировать ресурсы
   - Если подозрительный — заблокировать IP

---

## SLO Dashboard

### Cloudflare Analytics

**Доступ:**
- Cloudflare Dashboard → Analytics → Workers
- Метрики: Requests, Errors, Latency (p50/p95/p99)

**Настройка алертов:**
- Cloudflare Dashboard → Notifications → Add
- Условия:
  - Error rate > 1%
  - Latency p95 > 1000ms
  - Availability < 99%

### Grafana Dashboard (опционально)

Если нужен более детальный дашборд:

```yaml
# grafana-dashboard.yaml
dashboard:
  title: "Go2Asia API SLO Dashboard"
  panels:
    - title: "Availability"
      targets:
        - expr: 'sum(rate(http_requests_total{status=~"2.."}[5m])) / sum(rate(http_requests_total[5m]))'
    
    - title: "Latency p95"
      targets:
        - expr: 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))'
    
    - title: "Error Rate"
      targets:
        - expr: 'sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))'
```

---

## Правило: "No Dashboards — No Prod"

**Проверка перед деплоем:**

```bash
# Скрипт проверки
#!/bin/bash

# Проверить наличие алертов
if ! curl -s "https://api.cloudflare.com/client/v4/accounts/{account_id}/notifications" \
  -H "Authorization: Bearer {api_token}" | grep -q "error_rate"; then
  echo "❌ Alerts not configured!"
  exit 1
fi

# Проверить доступность дашборда
if ! curl -s "https://api.cloudflare.com/client/v4/accounts/{account_id}/analytics/workers" \
  -H "Authorization: Bearer {api_token}" | grep -q "requests"; then
  echo "❌ Dashboard not accessible!"
  exit 1
fi

echo "✅ Dashboards and alerts configured"
```

---

**Последнее обновление:** 2025-11-09

