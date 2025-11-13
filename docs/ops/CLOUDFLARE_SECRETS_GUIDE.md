# Руководство по секретам Cloudflare Workers

**Дата:** 2025-11-13  
**Статус:** Актуально для настройки секретов в Cloudflare Workers

---

## Обзор

В Cloudflare Workers секреты хранятся **отдельно для каждого окружения** (staging и production), но **имя секрета одинаковое** для обоих окружений.

---

## Как это работает?

### Имя секрета одинаковое, значения разные

**Важно:** Имя секрета (`DATABASE_URL`) одинаковое для staging и production, но **значения разные**:

- **Staging:** `DATABASE_URL` = `postgresql://staging-user:password@staging-host/database`
- **Production:** `DATABASE_URL` = `postgresql://prod-user:password@prod-host/database`

Cloudflare автоматически использует правильный секрет в зависимости от того, в какое окружение деплоится Worker.

---

## Способы установки секретов

### Способ 1: Через Cloudflare Dashboard (рекомендуется)

#### Для Staging окружения:

1. Откройте [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Перейдите в **Workers & Pages**
3. Найдите Worker (например, `content-service-production` или `content-service-staging`)
4. Откройте **Settings → Variables and Secrets**
5. Нажмите **+ Add** в секции **Secrets**
6. Введите:
   - **Name:** `DATABASE_URL`
   - **Value:** Connection string для staging (из Neon)
7. Нажмите **Save**

**Важно:** Если у вас есть отдельные Workers для staging и production (например, `content-service-staging` и `content-service-production`), нужно добавить секрет в каждый Worker отдельно.

#### Для Production окружения:

1. Найдите Worker для production (например, `content-service-production`)
2. Откройте **Settings → Variables and Secrets**
3. Добавьте `DATABASE_URL` с production connection string

### Способ 2: Через Wrangler CLI

#### Для Staging:

```bash
cd services/content-service
wrangler secret put DATABASE_URL --env staging
# Введите staging connection string когда попросит
```

#### Для Production:

```bash
cd services/content-service
wrangler secret put DATABASE_URL --env production
# Введите production connection string когда попросит
```

**Примечание:** Для использования Wrangler CLI нужно:
1. Установить Wrangler: `npm install -g wrangler`
2. Авторизоваться: `wrangler login`
3. Убедиться что в `wrangler.toml` правильно настроены `[env.staging]` и `[env.production]`

---

## Как проверить секреты в Cloudflare Dashboard?

### Если у вас отдельные Workers для staging и production:

1. **Staging Worker** (например, `content-service-staging`):
   - Workers & Pages → `content-service-staging` → Settings → Variables and Secrets
   - Должен быть `DATABASE_URL` со staging значением

2. **Production Worker** (например, `content-service-production`):
   - Workers & Pages → `content-service-production` → Settings → Variables and Secrets
   - Должен быть `DATABASE_URL` с production значением

### Если у вас один Worker с разными окружениями:

В Cloudflare Dashboard секреты отображаются для конкретного деплоя. Чтобы увидеть секреты для staging:
1. Откройте Worker
2. Перейдите в **Deployments**
3. Найдите deployment для staging
4. Откройте его → Settings → Variables and Secrets

---

## Пример для Content Service

### Структура в Cloudflare:

```
Workers & Pages
├── content-service-production (production Worker)
│   └── Settings → Variables and Secrets
│       ├── DATABASE_URL (production connection string)
│       └── SERVICE_JWT_SECRET
│
└── content-service-staging (staging Worker, если есть)
    └── Settings → Variables and Secrets
        ├── DATABASE_URL (staging connection string)
        └── SERVICE_JWT_SECRET
```

### Или один Worker с окружениями:

```
Workers & Pages
└── content-service
    ├── Deployments
    │   ├── production deployment
    │   │   └── DATABASE_URL (production)
    │   └── staging deployment
    │       └── DATABASE_URL (staging)
    └── Settings → Variables and Secrets
        └── (общие секреты, если есть)
```

---

## Чеклист для каждого сервиса

### Content Service

- [ ] **Staging:**
  - [ ] Worker: `content-service-staging` или deployment staging
  - [ ] `DATABASE_URL` = staging connection string
  - [ ] `SERVICE_JWT_SECRET` = общий секрет

- [ ] **Production:**
  - [ ] Worker: `content-service-production` или deployment production
  - [ ] `DATABASE_URL` = production connection string
  - [ ] `SERVICE_JWT_SECRET` = общий секрет

### Token Service

- [ ] **Staging:**
  - [ ] `DATABASE_URL` = staging connection string
  - [ ] `SERVICE_JWT_SECRET` = общий секрет

- [ ] **Production:**
  - [ ] `DATABASE_URL` = production connection string
  - [ ] `SERVICE_JWT_SECRET` = общий секрет

### Referral Service

- [ ] **Staging:**
  - [ ] `DATABASE_URL` = staging connection string
  - [ ] `SERVICE_JWT_SECRET` = общий секрет

- [ ] **Production:**
  - [ ] `DATABASE_URL` = production connection string
  - [ ] `SERVICE_JWT_SECRET` = общий секрет

### Auth Service

- [ ] **Staging:**
  - [ ] `CLERK_SECRET_KEY` = staging/test ключ
  - [ ] `CLERK_WEBHOOK_SECRET` = staging webhook secret
  - [ ] `SERVICE_JWT_SECRET` = общий секрет

- [ ] **Production:**
  - [ ] `CLERK_SECRET_KEY` = production ключ
  - [ ] `CLERK_WEBHOOK_SECRET` = production webhook secret
  - [ ] `SERVICE_JWT_SECRET` = общий секрет

---

## Важные замечания

1. **Имя секрета одинаковое:** `DATABASE_URL` для staging и production — это один и тот же секрет, но с разными значениями в разных окружениях.

2. **Секреты не зависят от GitHub:** Секреты в Cloudflare Workers хранятся отдельно и не требуют миграции при смене репозитория.

3. **Проверка после деплоя:** После первого деплоя проверьте что секреты применяются правильно, проверив логи Worker или сделав тестовый запрос.

4. **Безопасность:** Никогда не коммитьте connection strings в репозиторий. Используйте только секреты в Cloudflare Dashboard или через Wrangler CLI.

---

## Troubleshooting

### Проблема: Worker не видит секрет

**Решение:**
1. Проверьте что секрет добавлен для правильного окружения
2. Проверьте что деплой идёт в правильное окружение (`--env staging` или `--env production`)
3. Проверьте логи Worker на наличие ошибок

### Проблема: Используется неправильный DATABASE_URL

**Решение:**
1. Проверьте что секрет добавлен для правильного Worker/deployment
2. Убедитесь что деплой идёт в правильное окружение
3. Проверьте `wrangler.toml` — правильно ли настроены `[env.staging]` и `[env.production]`

---

## Ссылки

- [Cloudflare Workers Secrets Documentation](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Wrangler CLI Secrets](https://developers.cloudflare.com/workers/wrangler/commands/#secret)

---

**Последнее обновление:** 2025-11-13

