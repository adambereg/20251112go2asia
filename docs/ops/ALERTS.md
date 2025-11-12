# Cloudflare Alerts — Настройка алёртов

**Дата:** 2025-11-12  
**Статус:** Актуально для Фазы 0

---

## Обзор

Данный документ описывает настройку алёртов в Cloudflare для мониторинга экосистемы Go2Asia.

---

## Критические алёрты (P0)

### 1. Error Rate > 1%

**Описание:** Процент ошибок превышает 1% в течение 5 минут.

**Настройка в Cloudflare:**
1. Cloudflare Dashboard → Analytics → Alerts
2. Создать новое правило:
   - **Название:** `Error Rate Critical`
   - **Метрика:** Error Rate
   - **Условие:** > 1%
   - **Период:** 5 минут
   - **Уведомления:** Email, Slack, PagerDuty

**Действия при срабатывании:**
1. Проверить статус всех сервисов (`/health`, `/ready`)
2. Проверить логи Cloudflare Workers
3. Следовать Runbook: Ошибки 5xx в Content Service

---

### 2. Availability < 99%

**Описание:** Доступность сервиса ниже 99% в течение 10 минут.

**Настройка в Cloudflare:**
1. Cloudflare Dashboard → Analytics → Alerts
2. Создать новое правило:
   - **Название:** `Availability Critical`
   - **Метрика:** Availability
   - **Условие:** < 99%
   - **Период:** 10 минут
   - **Уведомления:** Email, Slack, PagerDuty

**Действия при срабатывании:**
1. Проверить статус Cloudflare (status.cloudflare.com)
2. Проверить статус всех сервисов
3. Проверить статус Neon БД
4. Следовать соответствующим Runbook'ам

---

### 3. Latency p95 > 1000ms

**Описание:** 95-й перцентиль латентности превышает 1000ms в течение 5 минут.

**Настройка в Cloudflare:**
1. Cloudflare Dashboard → Analytics → Alerts
2. Создать новое правило:
   - **Название:** `Latency Critical`
   - **Метрика:** Latency p95
   - **Условие:** > 1000ms
   - **Период:** 5 минут
   - **Уведомления:** Email, Slack

**Действия при срабатывании:**
1. Проверить метрики Neon БД (query time)
2. Проверить медленные запросы в логах
3. Следовать Runbook: Всплеск латентности

---

## Предупреждающие алёрты (P1)

### 4. Error Rate > 0.5%

**Описание:** Процент ошибок превышает 0.5% в течение 15 минут.

**Настройка в Cloudflare:**
1. Cloudflare Dashboard → Analytics → Alerts
2. Создать новое правило:
   - **Название:** `Error Rate Warning`
   - **Метрика:** Error Rate
   - **Условие:** > 0.5%
   - **Период:** 15 минут
   - **Уведомления:** Email

**Действия при срабатывании:**
1. Мониторить метрики
2. Проверить логи на наличие паттернов ошибок
3. Подготовиться к возможной эскалации

---

### 5. Latency p95 > 500ms

**Описание:** 95-й перцентиль латентности превышает 500ms в течение 15 минут.

**Настройка в Cloudflare:**
1. Cloudflare Dashboard → Analytics → Alerts
2. Создать новое правило:
   - **Название:** `Latency Warning`
   - **Метрика:** Latency p95
   - **Условие:** > 500ms
   - **Период:** 15 минут
   - **Уведомления:** Email

**Действия при срабатывании:**
1. Мониторить метрики
2. Проверить медленные запросы
3. Оптимизировать при необходимости

---

### 6. Error Budget исчерпан на 50%

**Описание:** Error Budget исчерпан на 50% за текущий период.

**Настройка:**
1. Cloudflare Dashboard → Analytics → SLO
2. Создать SLO для каждого сервиса:
   - **API Gateway:** Availability 99.9%, Error Rate < 0.1%
   - **Content Service:** Availability 99.5%, Error Rate < 0.2%
   - **Auth Service:** Availability 99.95%, Error Rate < 0.05%
   - **Token Service:** Availability 99.9%, Error Rate < 0.1%
3. Настроить алёрт при исчерпании 50% error budget

**Действия при срабатывании:**
1. Проверить метрики за период
2. Выявить причины ошибок
3. Принять меры по улучшению

---

## SLO/SLI метрики

### Service Level Objectives

| Сервис | Availability | Latency p95 | Error Rate |
|--------|--------------|-------------|------------|
| API Gateway | 99.9% | <200ms (GET), <500ms (POST) | <0.1% |
| Content Service | 99.5% | <300ms | <0.2% |
| Auth Service | 99.95% | <150ms | <0.05% |
| Token Service | 99.9% | <200ms | <0.1% |
| Referral Service | 99.5% | <300ms | <0.2% |

### Service Level Indicators

**Availability:**
- Формула: `(Total Requests - Error Requests) / Total Requests * 100%`
- Измерение: За последние 30 дней

**Latency p95:**
- Формула: 95-й перцентиль времени ответа
- Измерение: За последние 24 часа

**Error Rate:**
- Формула: `Error Requests / Total Requests * 100%`
- Измерение: За последние 24 часа

---

## Настройка уведомлений

### Email уведомления

1. Cloudflare Dashboard → Notifications → Email
2. Добавить email адреса для получения уведомлений
3. Настроить фильтры по важности (P0, P1)

### Slack интеграция

1. Cloudflare Dashboard → Notifications → Slack
2. Создать Slack App и добавить webhook URL
3. Настроить каналы для разных типов алёртов:
   - `#go2asia-alerts-critical` — для P0 алёртов
   - `#go2asia-alerts-warning` — для P1 алёртов

### PagerDuty интеграция

1. Cloudflare Dashboard → Notifications → PagerDuty
2. Создать PagerDuty Service
3. Настроить escalation policies для критичных алёртов

---

## Дашборды

### Cloudflare Analytics Dashboard

1. Cloudflare Dashboard → Analytics → Overview
2. Настроить виджеты для отслеживания:
   - Error Rate
   - Latency (p50, p95, p99)
   - Availability
   - Request Volume
   - Cache Hit Ratio

### Custom Dashboard (опционально)

Можно создать кастомный дашборд используя Cloudflare GraphQL API или сторонние инструменты (Grafana, Datadog).

---

## Тестирование алёртов

### Ручное тестирование

1. Создать тестовый алёрт с низким порогом
2. Сгенерировать тестовую нагрузку
3. Проверить срабатывание алёрта
4. Проверить доставку уведомлений

### Автоматическое тестирование

Можно использовать Cloudflare API для автоматического тестирования алёртов:

```bash
# Получить список алёртов
curl -X GET "https://api.cloudflare.com/client/v4/user/alerting/v3/alerts" \
  -H "Authorization: Bearer {api_token}"

# Создать тестовый алёрт
curl -X POST "https://api.cloudflare.com/client/v4/user/alerting/v3/alerts" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "Test Alert",
    "type": "error_rate",
    "threshold": 0.1,
    "period": 5
  }'
```

---

## Troubleshooting

### Проблема: Алёрты не срабатывают

**Решение:**
1. Проверить настройки алёртов в Cloudflare Dashboard
2. Проверить пороги (могут быть слишком высокими)
3. Проверить период измерения
4. Проверить метрики вручную

### Проблема: Слишком много ложных срабатываний

**Решение:**
1. Увеличить пороги
2. Увеличить период измерения
3. Добавить фильтры (например, исключить тестовые endpoints)
4. Настроить cooldown период

### Проблема: Уведомления не доставляются

**Решение:**
1. Проверить настройки уведомлений
2. Проверить email/Slack/PagerDuty интеграции
3. Проверить спам-фильтры для email
4. Проверить webhook URL для Slack

---

## Best Practices

1. **Начинать с консервативных порогов** — лучше получить больше уведомлений, чем пропустить критичный инцидент
2. **Настраивать escalation** — если алёрт не обработан за определённое время, эскалировать
3. **Регулярно пересматривать пороги** — по мере роста системы пороги могут потребовать корректировки
4. **Документировать все алёрты** — каждый алёрт должен иметь соответствующий Runbook
5. **Тестировать алёрты** — регулярно проверять работоспособность системы уведомлений

---

**Последнее обновление:** 2025-11-12

