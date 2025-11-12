# Runbooks — Руководства по инцидентам

**Дата:** 2025-11-12  
**Статус:** Актуально для Фазы 0

---

## Обзор

Данный документ содержит пошаговые инструкции по диагностике и решению типичных инцидентов в экосистеме Go2Asia.

---

## Runbook: Ошибки 5xx в Content Service

### Симптомы

- **Алерт:** Error rate > 1% в течение 5 минут
- **Симптомы пользователей:** Не могут загрузить контент (страны, города, места)
- **Метрики:** Высокий процент 500/502/503 ошибок

### Диагностика

1. **Проверить статус сервиса:**
   ```bash
   curl https://content.go2asia.space/health
   curl https://content.go2asia.space/ready
   ```

2. **Проверить логи Cloudflare Workers:**
   - Cloudflare Dashboard → Workers → `go2asia-content-service` → Logs
   - Искать ошибки с кодом 500/502/503
   - Проверить `X-Request-Id` для трассировки

3. **Проверить статус Neon БД:**
   - Neon Dashboard → Project → Status
   - Проверить метрики подключений
   - Проверить наличие активных запросов

4. **Проверить `/ready` endpoint:**
   ```bash
   curl https://content.go2asia.space/ready
   # Должен вернуть: {"status":"ready"}
   # Если {"status":"not ready"} → проблема с БД или внешними зависимостями
   ```

### Решение

**Если БД недоступна:**
1. Проверить Neon Dashboard на наличие инцидентов
2. Проверить connection string в переменных окружения
3. Проверить лимиты подключений (Neon free tier имеет ограничения)
4. Если проблема в Neon → связаться с поддержкой Neon или переключиться на backup БД

**Если код ошибки:**
1. Найти ошибку в логах по `X-Request-Id`
2. Проверить стектрейс
3. Исправить код и задеплоить hotfix

**Если временный сбой:**
1. Подождать 5 минут (может быть временная проблема Cloudflare или Neon)
2. Проверить статус снова
3. Если не решено → перейти к эскалации

### Эскалация

- **Если не решено за 15 минут** → связаться с DevOps командой
- **Если БД полностью недоступна** → использовать backup БД или восстановить из snapshot

---

## Runbook: Всплеск латентности

### Симптомы

- **Алерт:** Latency p95 > 1000ms в течение 5 минут
- **Симптомы пользователей:** Медленная загрузка страниц
- **Метрики:** Высокий p95/p99 latency

### Диагностика

1. **Проверить метрики Cloudflare:**
   - Cloudflare Dashboard → Analytics → Performance
   - Проверить latency по регионам
   - Проверить latency по endpoint'ам

2. **Проверить метрики Neon БД:**
   - Neon Dashboard → Metrics
   - Проверить query time
   - Проверить количество активных подключений

3. **Проверить медленные запросы:**
   ```bash
   # В логах Cloudflare Workers искать запросы с большой duration
   # Проверить X-Request-Id для трассировки
   ```

4. **Проверить rate limiting:**
   - Проверить не превышен ли rate limit
   - Проверить заголовки `X-RateLimit-Remaining`

### Решение

**Если проблема в БД:**
1. Проверить медленные запросы в Neon Dashboard
2. Оптимизировать запросы (добавить индексы)
3. Проверить connection pooling

**Если проблема в коде:**
1. Найти медленные операции в логах
2. Оптимизировать алгоритмы
3. Добавить кэширование для часто запрашиваемых данных

**Если проблема в Cloudflare:**
1. Проверить статус Cloudflare (status.cloudflare.com)
2. Проверить региональные проблемы
3. Если глобальная проблема → ждать восстановления

**Если проблема в rate limiting:**
1. Увеличить лимиты для критичных endpoints
2. Оптимизировать использование API
3. Добавить retry с exponential backoff

### Эскалация

- **Если не решено за 30 минут** → связаться с DevOps командой
- **Если проблема критична** → рассмотреть временное увеличение ресурсов

---

## Runbook: Ошибки Clerk Webhook

### Симптомы

- **Алерт:** Ошибки в Auth Service при обработке webhook'ов
- **Симптомы пользователей:** Проблемы с регистрацией/авторизацией
- **Метрики:** Высокий процент ошибок 400/401/403

### Диагностика

1. **Проверить статус Auth Service:**
   ```bash
   curl https://auth.go2asia.space/health
   curl https://auth.go2asia.space/ready
   ```

2. **Проверить доступность Clerk JWKS:**
   ```bash
   curl https://auth.go2asia.space/ready
   # Если {"status":"not ready", "error":"Clerk JWKS endpoint unavailable"}
   # → проблема с Clerk
   ```

3. **Проверить логи Auth Service:**
   - Cloudflare Dashboard → Workers → `go2asia-auth-service` → Logs
   - Искать ошибки при обработке webhook'ов
   - Проверить `X-Request-Id` для трассировки

4. **Проверить статус Clerk:**
   - Clerk Dashboard → Webhooks → Logs
   - Проверить статус доставки webhook'ов

### Решение

**Если Clerk недоступен:**
1. Проверить статус Clerk (status.clerk.com)
2. Если проблема в Clerk → ждать восстановления
3. Временно отключить проверку JWKS в `/ready` (только для диагностики)

**Если проблема с валидацией webhook:**
1. Проверить секрет webhook в переменных окружения
2. Проверить подпись webhook'а
3. Проверить формат данных webhook'а

**Если проблема с обработкой webhook:**
1. Проверить логи обработки
2. Исправить код обработки
3. Задеплоить исправление

### Эскалация

- **Если Clerk недоступен > 30 минут** → связаться с поддержкой Clerk
- **Если критичная проблема** → рассмотреть временное отключение webhook'ов

---

## Runbook: Проблемы с БД

### Симптомы

- **Алерт:** Database connection failed
- **Симптомы пользователей:** Ошибки при загрузке данных
- **Метрики:** Высокий процент ошибок 503

### Диагностика

1. **Проверить `/ready` endpoint:**
   ```bash
   curl https://content.go2asia.space/ready
   # Если {"status":"not ready", "error":"Database connection failed"}
   # → проблема с БД
   ```

2. **Проверить статус Neon:**
   - Neon Dashboard → Project → Status
   - Проверить метрики подключений
   - Проверить наличие активных запросов

3. **Проверить connection string:**
   - Проверить переменные окружения в Cloudflare Workers
   - Проверить формат connection string
   - Проверить права доступа

4. **Проверить лимиты:**
   - Neon Dashboard → Usage
   - Проверить не превышены ли лимиты (подключения, запросы)

### Решение

**Если БД недоступна:**
1. Проверить статус Neon (status.neon.tech)
2. Если проблема в Neon → ждать восстановления или использовать backup

**Если проблема с подключением:**
1. Проверить connection string
2. Проверить сетевую доступность
3. Проверить firewall правила

**Если превышены лимиты:**
1. Оптимизировать запросы
2. Уменьшить количество подключений
3. Рассмотреть upgrade плана Neon

**Если проблема с миграциями:**
1. Проверить статус миграций: `pnpm db:migrate:status`
2. Откатить проблемную миграцию: `pnpm db:migrate:down`
3. Исправить миграцию и применить заново

### Эскалация

- **Если БД полностью недоступна** → использовать backup БД или восстановить из snapshot
- **Если критичная проблема** → связаться с поддержкой Neon

---

## Runbook: Превышение rate limit

### Симптомы

- **Алерт:** Высокий процент 429 ошибок
- **Симптомы пользователей:** Запросы блокируются
- **Метрики:** Много запросов с кодом 429

### Диагностика

1. **Проверить заголовки rate limit:**
   ```bash
   curl -I https://api.go2asia.space/v1/api/content/countries
   # Проверить X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
   ```

2. **Проверить логи Gateway:**
   - Cloudflare Dashboard → Workers → `go2asia-api-gateway` → Logs
   - Искать запросы с кодом 429
   - Проверить IP адреса запросов

3. **Проверить метрики rate limiting:**
   - Cloudflare Dashboard → Analytics → Security
   - Проверить количество заблокированных запросов

### Решение

**Если легитимные пользователи блокируются:**
1. Увеличить rate limit для публичных endpoints
2. Добавить whitelist для известных IP адресов
3. Оптимизировать использование API на фронтенде

**Если DDoS атака:**
1. Включить Cloudflare DDoS Protection
2. Блокировать подозрительные IP адреса
3. Использовать Cloudflare Rate Limiting Rules

**Если проблема в коде:**
1. Проверить логику rate limiting в Gateway
2. Исправить баги в подсчёте лимитов
3. Задеплоить исправление

### Эскалация

- **Если DDoS атака** → включить Cloudflare DDoS Protection
- **Если критичная проблема** → временно увеличить лимиты

---

## Runbook: Проблемы с кэшем

### Симптомы

- **Симптомы пользователей:** Видят устаревшие данные
- **Метрики:** Низкий Cache Hit Ratio

### Диагностика

1. **Проверить заголовки кэша:**
   ```bash
   curl -I https://api.go2asia.space/v1/api/content/countries
   # Проверить Cache-Control заголовки
   ```

2. **Проверить Cloudflare Cache Rules:**
   - Cloudflare Dashboard → Rules → Cache Rules
   - Проверить правила кэширования

3. **Проверить метрики кэша:**
   - Cloudflare Dashboard → Analytics → Caching
   - Проверить Cache Hit Ratio

### Решение

**Если кэш не работает:**
1. Проверить Cache-Control заголовки в ответах
2. Проверить Cloudflare Cache Rules (не должно быть правил, отключающих кэш)
3. Проверить что запросы идут через Cloudflare

**Если устаревшие данные:**
1. Выполнить инвалидацию кэша через Cloudflare API
2. Уменьшить TTL для часто меняющихся данных
3. Использовать Cache Tags для точной инвалидации

**Если низкий Cache Hit Ratio:**
1. Проверить TTL (может быть слишком маленьким)
2. Оптимизировать запросы для лучшего кэширования
3. Добавить кэширование для большего количества endpoints

### Эскалация

- **Если критичная проблема** → выполнить полную инвалидацию кэша

---

## Общие процедуры

### Проверка статуса всех сервисов

```bash
# API Gateway
curl https://api.go2asia.space/health
curl https://api.go2asia.space/ready

# Content Service
curl https://content.go2asia.space/health
curl https://content.go2asia.space/ready

# Auth Service
curl https://auth.go2asia.space/health
curl https://auth.go2asia.space/ready

# Token Service
curl https://token.go2asia.space/health
curl https://token.go2asia.space/ready

# Referral Service
curl https://referral.go2asia.space/health
curl https://referral.go2asia.space/ready
```

### Трассировка запроса

1. Получить `X-Request-Id` из ответа или логов
2. Найти запрос в логах Cloudflare Workers по `X-Request-Id`
3. Проследить весь путь запроса через Gateway → Service → БД

### Rollback деплоя

1. Откатить миграции БД: `pnpm db:migrate:down`
2. Откатить код через Cloudflare Dashboard → Workers → Versions
3. Проверить работоспособность после rollback

---

## Контакты для эскалации

- **DevOps команда:** _заполнить_
- **Поддержка Cloudflare:** support.cloudflare.com
- **Поддержка Neon:** support.neon.tech
- **Поддержка Clerk:** support.clerk.com

---

**Последнее обновление:** 2025-11-12
