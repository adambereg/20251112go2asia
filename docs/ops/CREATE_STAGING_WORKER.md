# Создание Staging Worker для Content Service

**Дата:** 2025-11-13  
**Статус:** Инструкция по созданию staging Worker

---

## Обзор

Staging Worker создаётся автоматически при первом деплое в staging окружение. Есть два способа:

1. **Через GitHub Actions** (рекомендуется) — автоматический деплой создаст Worker
2. **Через Cloudflare Dashboard** (вручную) — создание Worker вручную перед деплоем

---

## Способ 1: Через GitHub Actions (рекомендуется)

### Шаг 1: Проверка конфигурации

Убедитесь что в `services/content-service/wrangler.toml` правильно настроено staging окружение:

```toml
name = "go2asia-content-service"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.staging]
name = "go2asia-content-service-staging"  # Имя для staging Worker
routes = [
  { pattern = "content-staging.go2asia.space/*", zone_name = "go2asia.space" }
]

[env.production]
routes = [
  { pattern = "content.go2asia.space/*", zone_name = "go2asia.space" }
]
```

### Шаг 2: Запуск деплоя

1. Откройте GitHub репозиторий
2. Перейдите в **Actions**
3. Найдите workflow **"Deploy to Staging"**
4. Нажмите **"Run workflow"** → выберите ветку `main` → **"Run workflow"**
5. Дождитесь завершения деплоя

**Результат:** Worker `go2asia-content-service-staging` будет создан автоматически при первом деплое.

### Шаг 3: Проверка создания Worker

1. Откройте [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Перейдите в **Workers & Pages**
3. Найдите Worker `go2asia-content-service-staging`
4. Откройте **Settings → Variables and Secrets**
5. Добавьте секреты:
   - `DATABASE_URL` = staging connection string из Neon
   - `SERVICE_JWT_SECRET` = общий секрет

---

## Способ 2: Через Cloudflare Dashboard (вручную)

### Шаг 1: Создание Worker

1. Откройте [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Перейдите в **Workers & Pages**
3. Нажмите **"Create application"** или **"Create Worker"**
4. Выберите **"Create Worker"**
5. Введите:
   - **Name:** `go2asia-content-service-staging`
   - **HTTP handler:** Оставьте по умолчанию
6. Нажмите **"Deploy"**

**Примечание:** Это создаст пустой Worker. Код будет добавлен при деплое через GitHub Actions или Wrangler CLI.

### Шаг 2: Настройка секретов

1. Откройте созданный Worker `go2asia-content-service-staging`
2. Перейдите в **Settings → Variables and Secrets**
3. Добавьте секреты:
   - **`DATABASE_URL`** = staging connection string из Neon (`go2asia-staging` проект)
   - **`SERVICE_JWT_SECRET`** = общий секрет (такой же как в production)
4. Добавьте переменную:
   - **`NODE_ENV`** = `staging` (Plaintext)

### Шаг 3: Настройка Routes (опционально)

Если нужно настроить кастомный домен:

1. Откройте **Settings → Domains & Routes**
2. Нажмите **"Add route"**
3. Введите:
   - **Route:** `content-staging.go2asia.space/*`
   - **Zone:** `go2asia.space`
4. Нажмите **"Add route"**

**Примечание:** Routes можно настроить и через `wrangler.toml` при деплое.

---

## Проверка после создания

### 1. Проверка Worker в Cloudflare Dashboard

- [ ] Worker `go2asia-content-service-staging` существует
- [ ] Секрет `DATABASE_URL` добавлен со staging значением
- [ ] Секрет `SERVICE_JWT_SECRET` добавлен
- [ ] Переменная `NODE_ENV` = `staging` (если нужна)

### 2. Проверка через деплой

После создания Worker через Dashboard, запустите деплой через GitHub Actions чтобы обновить код:

1. Откройте GitHub → **Actions**
2. Запустите workflow **"Deploy to Staging"**
3. Проверьте что деплой прошёл успешно

### 3. Проверка работы Worker

После деплоя проверьте что Worker отвечает:

```bash
# Проверка через workers.dev URL
curl https://go2asia-content-service-staging.YOUR_SUBDOMAIN.workers.dev/health

# Или через кастомный домен (если настроен)
curl https://content-staging.go2asia.space/health
```

---

## Важные замечания

1. **Имя Worker:** Должно совпадать с `name` в секции `[env.staging]` в `wrangler.toml`
   - В `wrangler.toml`: `name = "go2asia-content-service-staging"`
   - В Cloudflare: `go2asia-content-service-staging`

2. **Секреты:** Секреты нужно добавить **после** создания Worker, но **до** первого деплоя кода

3. **Routes:** Routes можно настроить через Dashboard или через `wrangler.toml` (при деплое)

4. **Отдельные Workers:** Staging и Production — это **отдельные Workers** с разными секретами

---

## Troubleshooting

### Проблема: Worker не создаётся при деплое

**Решение:**
1. Проверьте что в `wrangler.toml` правильно указано имя для staging: `[env.staging] name = "go2asia-content-service-staging"`
2. Проверьте что секреты `CLOUDFLARE_STAGING_API_TOKEN` и `CLOUDFLARE_STAGING_ACCOUNT_ID` добавлены в GitHub Secrets
3. Проверьте логи GitHub Actions на наличие ошибок

### Проблема: Worker создан, но не видит секреты

**Решение:**
1. Убедитесь что секреты добавлены в правильный Worker (`go2asia-content-service-staging`)
2. Проверьте что секреты добавлены для правильного окружения (staging)
3. Перезапустите Worker или сделайте новый деплой

---

## Следующие шаги

После создания staging Worker:

1. ✅ Добавьте секреты (`DATABASE_URL`, `SERVICE_JWT_SECRET`)
2. ✅ Запустите деплой через GitHub Actions
3. ✅ Проверьте что Worker отвечает на запросы
4. ✅ Повторите для других сервисов (token-service, referral-service, auth-service)

---

**Последнее обновление:** 2025-11-13

