# SLO/SLI — Service Level Objectives and Indicators

**Дата:** 2025-11-12  
**Статус:** Актуально для Фазы 0

---

## Обзор

Данный документ описывает Service Level Objectives (SLO) и Service Level Indicators (SLI) для экосистемы Go2Asia.

---

## Service Level Objectives (SLO)

### Общие SLO для всех сервисов

| Метрика | Цель | Период измерения | Error Budget |
|---------|------|-----------------|--------------|
| **Availability** | 99.5% | 30 дней | 0.5% (3.6 часа) |
| **Error Rate** | < 1% | 24 часа | 1% |
| **Latency p95** | < 300ms (публичные GET) | 24 часа | - |

### SLO по сервисам

#### API Gateway

| Метрика | Цель | Период |
|---------|------|--------|
| Availability | 99.9% | 30 дней |
| Error Rate | < 0.1% | 24 часа |
| Latency p95 | < 200ms (GET), < 500ms (POST) | 24 часа |
| Throughput | > 1000 req/s | 1 час |
| 429 Rate | < 0.5% | 24 часа |
| Timeouts | < 0.1% | 24 часа |

#### Content Service

| Метрика | Цель | Период |
|---------|------|--------|
| Availability | 99.5% | 30 дней |
| Error Rate | < 0.2% | 24 часа |
| Latency p95 | < 300ms | 24 часа |
| Database Query Time | < 100ms (p95) | 24 часа |

#### Auth Service

| Метрика | Цель | Период |
|---------|------|--------|
| Availability | 99.95% | 30 дней |
| Error Rate | < 0.05% | 24 часа |
| Latency p95 | < 150ms | 24 часа |
| Clerk JWKS Availability | 99.9% | 30 дней |

#### Token Service

| Метрика | Цель | Период |
|---------|------|--------|
| Availability | 99.9% | 30 дней |
| Error Rate | < 0.1% | 24 часа |
| Latency p95 | < 200ms | 24 часа |
| Transaction Success Rate | > 99.9% | 24 часа |
| Idempotency Compliance | 100% | Всегда |

#### Referral Service

| Метрика | Цель | Период |
|---------|------|--------|
| Availability | 99.5% | 30 дней |
| Error Rate | < 0.2% | 24 часа |
| Latency p95 | < 300ms | 24 часа |

---

## Service Level Indicators (SLI)

### Availability SLI

**Формула:**
```
Availability = (Total Requests - Error Requests) / Total Requests * 100%
```

**Измерение:**
- **Период:** За последние 30 дней
- **Ошибки:** HTTP статусы 5xx, таймауты, недоступность сервиса
- **Исключения:** Плановые работы (maintenance windows)

**Расчёт Error Budget:**
```
Error Budget = (1 - SLO) * Period Duration
Пример: (1 - 0.995) * 30 дней * 24 часа = 3.6 часа
```

### Error Rate SLI

**Формула:**
```
Error Rate = Error Requests / Total Requests * 100%
```

**Измерение:**
- **Период:** За последние 24 часа
- **Ошибки:** HTTP статусы 4xx (кроме 429), 5xx
- **Исключения:** 429 (rate limit) учитываются отдельно

### Latency SLI

**Формула:**
```
Latency p95 = 95-й перцентиль времени ответа
```

**Измерение:**
- **Период:** За последние 24 часа
- **Метрика:** Время от получения запроса до отправки ответа
- **Разделение:** По типам запросов (GET, POST, PUT, DELETE)

### Throughput SLI

**Формула:**
```
Throughput = Total Requests / Time Period
```

**Измерение:**
- **Период:** За последний 1 час
- **Метрика:** Количество успешных запросов в секунду

### 429 Rate SLI

**Формула:**
```
429 Rate = 429 Requests / Total Requests * 100%
```

**Измерение:**
- **Период:** За последние 24 часа
- **Метрика:** Процент запросов, заблокированных rate limit'ом

### Timeout Rate SLI

**Формула:**
```
Timeout Rate = Timeout Requests / Total Requests * 100%
```

**Измерение:**
- **Период:** За последние 24 часа
- **Метрика:** Процент запросов, завершившихся таймаутом

---

## Дашборды

### Cloudflare Analytics Dashboard

**Карточки для мониторинга:**

1. **Availability (30 дней)**
   - Формула: `(Total - Errors) / Total * 100%`
   - Цель: ≥ 99.5%
   - Error Budget: Автоматический расчёт

2. **Error Rate**
   - Формула: `Errors / Total * 100%`
   - Цель: < 1%
   - Разбивка: По статусам (4xx, 5xx)

3. **Latency p95**
   - Метрика: 95-й перцентиль времени ответа
   - Цель: < 300ms (публичные GET)
   - Разбивка: По endpoint'ам

4. **Throughput**
   - Метрика: Запросов в секунду
   - Цель: > 1000 req/s (Gateway)
   - Разбивка: По сервисам

5. **429 Rate**
   - Формула: `429 / Total * 100%`
   - Цель: < 0.5%
   - Разбивка: По endpoint'ам

6. **Timeouts**
   - Формула: `Timeouts / Total * 100%`
   - Цель: < 0.1%
   - Разбивка: По сервисам

### Настройка дашборда в Cloudflare

1. Cloudflare Dashboard → Analytics → Custom Dashboard
2. Создать виджеты для каждой метрики:
   - **Availability:** `(sum(rate(http_requests_total{status!~"5.."})) / sum(rate(http_requests_total))) * 100`
   - **Error Rate:** `sum(rate(http_requests_total{status=~"5.."})) / sum(rate(http_requests_total)) * 100`
   - **Latency p95:** `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket)) by (le))`
   - **Throughput:** `sum(rate(http_requests_total))`
   - **429 Rate:** `sum(rate(http_requests_total{status="429"})) / sum(rate(http_requests_total)) * 100`
   - **Timeouts:** `sum(rate(http_requests_total{timeout="true"})) / sum(rate(http_requests_total)) * 100`

3. Настроить алёрты при нарушении SLO:
   - **Availability < 99.5%** → P0 алёрт
   - **Error Rate > 1%** → P0 алёрт
   - **Latency p95 > 300ms** → P1 алёрт
   - **Error Budget исчерпан на 50%** → P1 алёрт

---

## Error Budget Policy

### Правила использования Error Budget

1. **Если Error Budget исчерпан на 50%:**
   - Отправить предупреждение команде
   - Провести анализ причин
   - Принять меры по улучшению

2. **Если Error Budget исчерпан на 75%:**
   - Остановить деплой новых фич
   - Сфокусироваться на стабильности
   - Провести post-mortem

3. **Если Error Budget исчерпан на 100%:**
   - Полный freeze деплоев
   - Критический анализ всех инцидентов
   - План восстановления Error Budget

### Что отключать первым при исчерпании Error Budget

**Приоритет отключения (от низкого к высокому):**

1. **Новые фичи (не критичные)**
   - Отключить feature flags для новых фич
   - Откатить последние деплои

2. **Тяжёлые операции**
   - Отключить сложные запросы (например, большие списки)
   - Упростить логику обработки

3. **Кэш-байпас**
   - Включить агрессивное кэширование
   - Увеличить TTL для стабильного контента

4. **Не критичные endpoints**
   - Отключить аналитику
   - Отключить не критичные webhook'и

5. **Деградация функциональности**
   - Вернуться к базовой функциональности
   - Отключить оптимизации

**Runbook:** См. `docs/ops/RUNBOOKS.md` → "Error Budget исчерпан"

---

## Метрики для мониторинга

### Ключевые метрики

1. **Request Volume**
   - Общее количество запросов
   - По сервисам и endpoint'ам
   - Тренды за последние 7 дней

2. **Success Rate**
   - Процент успешных запросов (2xx)
   - По сервисам и endpoint'ам

3. **Cache Hit Ratio**
   - Процент запросов, обслуженных из кэша
   - По типам контента

4. **Database Metrics**
   - Query time (p50, p95, p99)
   - Connection pool usage
   - Slow queries count

5. **External Dependencies**
   - Clerk JWKS availability
   - Neon database availability
   - Response times внешних сервисов

---

## Автоматизация

### Автоматический расчёт Error Budget

**Формула:**
```javascript
const errorBudget = (1 - slo) * periodDuration;
const errorBudgetUsed = (totalErrors / totalRequests) * periodDuration;
const errorBudgetRemaining = errorBudget - errorBudgetUsed;
const errorBudgetPercentage = (errorBudgetRemaining / errorBudget) * 100;
```

**Алёрты:**
- **Error Budget < 50%** → Warning
- **Error Budget < 25%** → Critical
- **Error Budget < 0%** → Emergency

### Интеграция с Cloudflare

Можно использовать Cloudflare GraphQL API для автоматического расчёта метрик:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/graphql" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "query": "query { viewer { zones(filter: {zoneTag: \"{zone_id}\"}) { httpRequests1dGroups(limit: 1) { sum { requests errors } } } } }"
  }'
```

---

## Best Practices

1. **Начинать с консервативных SLO** — лучше установить достижимые цели и улучшать их со временем
2. **Регулярно пересматривать SLO** — по мере роста системы SLO могут потребовать корректировки
3. **Документировать все изменения SLO** — каждое изменение должно быть обосновано
4. **Мониторить Error Budget** — следить за использованием Error Budget и принимать меры заранее
5. **Использовать SLO для принятия решений** — Error Budget должен влиять на приоритеты разработки

---

## Troubleshooting

### Проблема: SLO постоянно нарушаются

**Решение:**
1. Провести анализ причин нарушений
2. Оптимизировать проблемные участки
3. Рассмотреть корректировку SLO (если они нереалистичны)

### Проблема: Error Budget исчерпывается слишком быстро

**Решение:**
1. Провести анализ инцидентов
2. Улучшить стабильность системы
3. Рассмотреть увеличение Error Budget (если SLO слишком строгие)

### Проблема: Метрики не соответствуют реальности

**Решение:**
1. Проверить правильность формул
2. Проверить корректность сбора метрик
3. Исключить некорректные данные (например, тестовые запросы)

---

**Последнее обновление:** 2025-11-12

