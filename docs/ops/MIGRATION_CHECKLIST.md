# Чеклист миграции инфраструктуры

**Дата:** 2025-11-13  
**Статус:** Практический чеклист для пошаговой миграции

---

## ✅ Шаг 1: GitHub Secrets — ГОТОВО

- [x] Секреты скопированы из старого репо в новый
- [x] Проверены имена секретов в workflows

**Скопированные секреты:**
- [x] `CLERK_WEBHOOK_SECRET`
- [x] `CLOUDFLARE_ACCOUNT_ID` (общий)
- [x] `CLOUDFLARE_API_TOKEN` (общий)
- [x] `SERVICE_JWT_SECRET`

**⚠️ ВАЖНО:** Workflows используют отдельные секреты для staging и production. Нужно либо:
1. Создать отдельные секреты (рекомендуется):
   - [x] `CLOUDFLARE_STAGING_API_TOKEN` (скопировать из `CLOUDFLARE_API_TOKEN`)
   - [x] `CLOUDFLARE_STAGING_ACCOUNT_ID` (скопировать из `CLOUDFLARE_ACCOUNT_ID`)
   - [x] `CLOUDFLARE_PRODUCTION_API_TOKEN` (скопировать из `CLOUDFLARE_API_TOKEN`)
   - [x] `CLOUDFLARE_PRODUCTION_ACCOUNT_ID` (скопировать из `CLOUDFLARE_ACCOUNT_ID`)

2. Или обновить workflows чтобы использовать общие секреты (менее безопасно)

**Осталось добавить (после генерации фронтенда):**
- [ ] `NETLIFY_AUTH_TOKEN`
- [ ] `NETLIFY_PREVIEW_SITE_ID`
- [ ] `NETLIFY_STAGING_SITE_ID`
- [ ] `NETLIFY_PRODUCTION_SITE_ID`

---

## ✅ Шаг 2: GitHub Environments — ГОТОВО

- [x] Создан `staging` environment
- [x] Создан `production` environment
- [x] Production настроен с Required reviewers (`adambereg`)
- [x] Production настроен с Deployment branches (`main`)

**Текущая конфигурация:**
- **Staging:** Без защиты (быстрые деплои)
- **Production:** С защитой (required reviewers, только `main`)

---

## ⏳ Шаг 3: Netlify — ОТЛОЖЕНО

**Когда делать:** После генерации фронтенда и перед первым деплоем.

**Что нужно сделать:**

### 3.1 Preview сайт
- [ ] Открыть Netlify Dashboard
- [ ] Найти Preview сайт
- [ ] Site settings → Build & deploy → Continuous Deployment
- [ ] Link to Git provider → GitHub
- [ ] Выбрать репозиторий: `adambereg/20251112go2asia`
- [ ] Выбрать ветку: `main`
- [ ] Build command: `pnpm build` (или `cd apps/go2asia-pwa-shell && pnpm build`)
- [ ] Publish directory: `apps/go2asia-pwa-shell/.next`
- [ ] Скопировать Site ID → добавить в GitHub Secrets как `NETLIFY_PREVIEW_SITE_ID`

### 3.2 Staging сайт
- [ ] Найти Staging сайт в Netlify Dashboard
- [ ] Перепривязать к новому репо (аналогично Preview)
- [ ] Скопировать Site ID → добавить в GitHub Secrets как `NETLIFY_STAGING_SITE_ID`

### 3.3 Production сайт
- [ ] Найти Production сайт в Netlify Dashboard
- [ ] Перепривязать к новому репо (аналогично Staging)
- [ ] Скопировать Site ID → добавить в GitHub Secrets как `NETLIFY_PRODUCTION_SITE_ID`

---

## ⏳ Шаг 4: Cloudflare Workers — ПРОВЕРИТЬ

### 4.1 Проверка wrangler.toml файлов

**Проверить что все файлы содержат правильные настройки:**

- [x] `apps/api-gateway/wrangler.toml`
  - [x] Production route: `api.go2asia.space/*`
  - [x] Staging route: `api-staging.go2asia.space/*`
  - [x] Zone name: `go2asia.space`

- [x] `services/content-service/wrangler.toml`
  - [x] Production route: `content.go2asia.space/*`
  - [x] Staging route: `content-staging.go2asia.space/*`

- [x] `services/auth-service/wrangler.toml`
  - [x] Production route: `auth.go2asia.space/*`
  - [x] Staging route: `auth-staging.go2asia.space/*`

- [x] `services/token-service/wrangler.toml`
  - [x] Production route: `token.go2asia.space/*`
  - [x] Staging route: `token-staging.go2asia.space/*`

- [x] `services/referral-service/wrangler.toml`
  - [x] Production route: `referral.go2asia.space/*` (исправлено с `connect.go2asia.space/*`)
  - [x] Staging route: `referral-staging.go2asia.space/*` (исправлено с `connect-staging.go2asia.space/*`)

### 4.2 Проверка секретов в Cloudflare Workers

**Для каждого Worker проверить секреты:**

- [x] **API Gateway** (`go2asia-api-gateway`)
  - [x] `SERVICE_JWT_SECRET` (если используется)

- [ ] **Content Service** (`go2asia-content-service`)
  - [ ] `DATABASE_URL` (staging) — добавить в Cloudflare Dashboard для staging Worker/deployment
  - [ ] `DATABASE_URL` (production) — добавить в Cloudflare Dashboard для production Worker/deployment
  - [ ] `SERVICE_JWT_SECRET` — общий для обоих окружений
  - **💡 Примечание:** Имя секрета одинаковое (`DATABASE_URL`), но значения разные для staging и production. См. [CLOUDFLARE_SECRETS_GUIDE.md](CLOUDFLARE_SECRETS_GUIDE.md)

- [ ] **Auth Service** (`go2asia-auth-service`)
  - [ ] `CLERK_SECRET_KEY`
  - [ ] `CLERK_WEBHOOK_SECRET`
  - [ ] `SERVICE_JWT_SECRET`

- [ ] **Token Service** (`go2asia-token-service`)
  - [ ] `DATABASE_URL` (staging)
  - [ ] `DATABASE_URL` (production)
  - [ ] `SERVICE_JWT_SECRET`

- [ ] **Referral Service** (`go2asia-referral-service`)
  - [ ] `DATABASE_URL` (staging)
  - [ ] `DATABASE_URL` (production)
  - [ ] `SERVICE_JWT_SECRET`
  - [x] Routes исправлены: `referral.go2asia.space/*` и `referral-staging.go2asia.space/*`

**Как проверить:**
1. Cloudflare Dashboard → Workers & Pages
2. Выбрать Worker (для staging или production)
3. Settings → Variables and Secrets
4. Проверить что все секреты на месте

**💡 Важно:** Имя секрета одинаковое (`DATABASE_URL`), но значения разные для staging и production. Нужно добавить секрет отдельно для каждого окружения в Cloudflare Dashboard.

**Подробнее:** См. [CLOUDFLARE_SECRETS_GUIDE.md](CLOUDFLARE_SECRETS_GUIDE.md) для детальных инструкций.

**Примечание:** Секреты в Cloudflare Workers не зависят от GitHub репозитория и остаются прежними. Просто проверьте что они есть для каждого окружения.

---

## ⏳ Шаг 5: Clerk — ПРОВЕРИТЬ

### 5.1 Проверка Webhook URLs

- [ ] Открыть Clerk Dashboard → Webhooks
- [ ] Проверить Endpoint URL для каждого webhook'а
- [ ] Если webhook'и указывают на Cloudflare Workers — ничего менять не нужно
- [ ] Если webhook'и используют GitHub-specific URLs — обновить их

**Ожидаемые webhook URLs:**
- Auth Service webhook: `https://auth.go2asia.space/webhook` (production)
- Auth Service webhook: `https://auth-staging.go2asia.space/webhook` (staging)

### 5.2 Проверка секретов Clerk

- [ ] `CLERK_SECRET_KEY` — в GitHub Secrets (уже есть)
- [ ] `CLERK_WEBHOOK_SECRET` — в GitHub Secrets (уже есть)
- [ ] `CLERK_SECRET_KEY` — в Cloudflare Workers (Auth Service)
- [ ] `CLERK_WEBHOOK_SECRET` — в Cloudflare Workers (Auth Service)

---

## ⏳ Шаг 6: Neon — ПРОВЕРИТЬ

### 6.1 Проверка Connection Strings

**💡 ВАЖНО:** В Neon создаются **отдельные проекты** для staging и production. У каждого проекта свой connection string с разными хостами (endpoints). Не нужно менять имя пользователя в connection string!

- [ ] Открыть Neon Console
- [ ] Найти staging проект (или создать новый если его нет)
- [ ] Скопировать Connection String из staging проекта
- [ ] Проверить что он добавлен в GitHub Secrets как `STAGING_DATABASE_URL`
- [ ] Найти production проект (или использовать существующий)
- [ ] Скопировать Connection String из production проекта
- [ ] Проверить что он добавлен в GitHub Secrets как `PRODUCTION_DATABASE_URL`

**Проверка:**
- Connection strings должны иметь **разные хосты** (endpoints)
- Например: `ep-staging-xxx-pooler.c-2.us-east-1.aws.neon.tech` vs `ep-production-xxx-pooler.c-2.us-east-1.aws.neon.tech`

**Подробнее:** См. [NEON_SETUP_GUIDE.md](NEON_SETUP_GUIDE.md) для детальных инструкций.

**Примечание:** Если у вас только один проект Neon, создайте второй проект для staging. Connection strings остаются прежними для существующих проектов, просто убедитесь что они добавлены в новый репозиторий.

### 6.2 Проверка миграций

**После первого деплоя проверить:**
- [ ] Миграции применяются успешно
- [ ] Таблица `schema_migrations` создана
- [ ] Seed данные применены

---

## ⏳ Шаг 7: Проверка Workflows

### 7.1 Проверка имен секретов

**Проверить что имена секретов в workflows совпадают с GitHub Secrets:**

- [ ] `.github/workflows/preview-deploy.yml`
  - [ ] `NETLIFY_PREVIEW_AUTH_TOKEN`
  - [ ] `NETLIFY_PREVIEW_SITE_ID`

- [ ] `.github/workflows/staging-deploy.yml`
  - [ ] `CLOUDFLARE_STAGING_API_TOKEN`
  - [ ] `CLOUDFLARE_STAGING_ACCOUNT_ID`
  - [ ] `NETLIFY_STAGING_AUTH_TOKEN`
  - [ ] `NETLIFY_STAGING_SITE_ID`
  - [ ] `STAGING_DATABASE_URL`

- [ ] `.github/workflows/production-deploy.yml`
  - [ ] `CLOUDFLARE_PRODUCTION_API_TOKEN`
  - [ ] `CLOUDFLARE_PRODUCTION_ACCOUNT_ID`
  - [ ] `NETLIFY_PRODUCTION_AUTH_TOKEN`
  - [ ] `NETLIFY_PRODUCTION_SITE_ID`
  - [ ] `PRODUCTION_DATABASE_URL`

**Примечание:** Если в старом репо использовались общие секреты (например, `CLOUDFLARE_API_TOKEN` вместо `CLOUDFLARE_STAGING_API_TOKEN`), нужно либо:
1. Переименовать секреты в GitHub
2. Или обновить workflows чтобы использовать общие секреты

### 7.2 Проверка путей деплоя

- [ ] Cloudflare Workers: `workingDirectory` правильные
- [ ] Netlify: `--dir` пути правильные
- [ ] Тесты: пути к тестам правильные

---

## ⏳ Шаг 8: Тестовый деплой

### 8.1 Тест Preview деплоя

**Когда:** После перепривязки Netlify Preview сайта.

- [ ] Создать тестовый PR в новом репозитории
- [ ] Проверить что запускается workflow `preview-deploy.yml`
- [ ] Проверить что деплой на Netlify проходит успешно
- [ ] Проверить что preview URL доступен
- [ ] Проверить что Lighthouse тесты проходят

### 8.2 Тест Staging деплоя

**Когда:** После перепривязки Netlify Staging сайта и проверки Cloudflare Workers.

- [ ] Сделать push в ветку `main`
- [ ] Проверить что запускается workflow `staging-deploy.yml`
- [ ] Проверить что миграции применяются успешно
- [ ] Проверить что Cloudflare Workers деплоятся
- [ ] Проверить что Netlify деплоится
- [ ] Проверить что smoke tests проходят
- [ ] Проверить что contract tests проходят
- [ ] Проверить что Lighthouse тесты проходят

### 8.3 Тест Production деплоя

**Когда:** После успешного теста Staging деплоя.

- [ ] Запустить production workflow вручную (`workflow_dispatch`)
- [ ] Ввести версию (например, `v0.1.0`)
- [ ] Ввести подтверждение (`deploy`)
- [ ] Апрувить деплой (как required reviewer)
- [ ] Проверить что все шаги проходят успешно
- [ ] Проверить что production сайт обновляется

---

## 📋 Быстрая проверка перед началом

**Перед началом миграции убедитесь что:**

- [x] GitHub Secrets скопированы
- [x] GitHub Environments настроены
- [ ] Cloudflare Workers секреты проверены
- [ ] Neon Connection Strings проверены
- [ ] Clerk webhook URLs проверены

**Можно начинать с:**
1. Проверка Cloudflare Workers (Шаг 4)
2. Проверка Clerk (Шаг 5)
3. Проверка Neon (Шаг 6)
4. Netlify (после генерации фронтенда)

---

## 🚨 Важные замечания

1. **Секреты Cloudflare Workers** не требуют миграции — они остаются прежними
2. **Neon Connection Strings** не меняются — просто добавьте их в GitHub Secrets
3. **Clerk webhook URLs** обычно не требуют изменений (если указывают на Cloudflare Workers)
4. **Netlify** можно настроить после генерации фронтенда
5. **Тестовые деплои** лучше делать поэтапно: сначала Preview, потом Staging, потом Production

---

## 📞 Troubleshooting

Если что-то не работает:

1. Проверьте логи в GitHub Actions
2. Проверьте логи в Cloudflare Dashboard
3. Проверьте логи в Netlify Dashboard
4. Проверьте что все секреты добавлены правильно
5. Проверьте что имена секретов совпадают в workflows и GitHub Secrets

---

**Последнее обновление:** 2025-11-13

