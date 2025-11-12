# Руководство по миграции инфраструктуры к новому репозиторию

**Дата:** 2025-11-12  
**Статус:** Актуально для миграции с существующей инфраструктуры

---

## Обзор

Данное руководство описывает процесс миграции существующих настроек инфраструктуры (Netlify, Cloudflare, Clerk, Neon) к новому GitHub репозиторию `https://github.com/adambereg/20251112go2asia`.

**Важно:** Инфраструктура (домены, сервисы, базы данных) остаётся прежней. Меняется только источник кода (GitHub репозиторий).

---

## Шаг 1: GitHub Secrets — копирование секретов

### 1.1 Экспорт секретов из старого репозитория

1. Откройте старый репозиторий на GitHub
2. Перейдите в **Settings → Secrets and variables → Actions**
3. Запишите все существующие секреты:

**Netlify:**
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_PREVIEW_AUTH_TOKEN` (если есть)
- `NETLIFY_STAGING_AUTH_TOKEN` (если есть)
- `NETLIFY_PRODUCTION_AUTH_TOKEN` (если есть)
- `NETLIFY_SITE_ID`
- `NETLIFY_PREVIEW_SITE_ID` (если есть)
- `NETLIFY_STAGING_SITE_ID`
- `NETLIFY_PRODUCTION_SITE_ID`

**Cloudflare:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_STAGING_API_TOKEN` (если есть)
- `CLOUDFLARE_PRODUCTION_API_TOKEN` (если есть)
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_STAGING_ACCOUNT_ID` (если есть)
- `CLOUDFLARE_PRODUCTION_ACCOUNT_ID` (если есть)

**Database:**
- `STAGING_DATABASE_URL`
- `PRODUCTION_DATABASE_URL`

**Clerk (если используются в CI):**
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`

### 1.2 Импорт секретов в новый репозиторий

1. Откройте новый репозиторий: `https://github.com/adambereg/20251112go2asia`
2. Перейдите в **Settings → Secrets and variables → Actions**
3. Добавьте все секреты из старого репозитория:

**Для каждого секрета:**
- Нажмите **New repository secret**
- Введите **Name** (точно как в старом репо)
- Вставьте **Secret** (значение из старого репо)
- Нажмите **Add secret**

**Проверка:**
- Убедитесь что все секреты добавлены
- Проверьте что имена секретов совпадают с теми, что используются в `.github/workflows/*.yml`

---

## Шаг 2: GitHub Environments — настройка окружений

### 2.1 Создание окружений

1. В новом репозитории перейдите в **Settings → Environments**
2. Создайте окружения (если их нет):

**Staging:**
- Нажмите **New environment**
- Имя: `staging`
- Добавьте **Deployment branches**: `main` (опционально)
- Добавьте **Required reviewers** (если нужны)

**Production:**
- Нажмите **New environment**
- Имя: `production`
- Добавьте **Deployment branches**: `main` (обязательно)
- Добавьте **Required reviewers** (рекомендуется)

### 2.2 Добавление секретов в окружения

Если у вас есть секреты, специфичные для окружений (например, `STAGING_DATABASE_URL`), добавьте их в соответствующие окружения:

1. Выберите окружение (например, `staging`)
2. В разделе **Environment secrets** нажмите **Add secret**
3. Добавьте секреты для этого окружения

**Примечание:** Секреты на уровне репозитория доступны всем окружениям. Секреты на уровне окружения переопределяют репозиторные.

---

## Шаг 3: Netlify — перепривязка сайтов

### 3.1 Перепривязка Preview сайта

1. Откройте [Netlify Dashboard](https://app.netlify.com/)
2. Найдите ваш Preview сайт
3. Перейдите в **Site settings → Build & deploy → Continuous Deployment**
4. Нажмите **Link to Git provider**
5. Выберите **GitHub**
6. Выберите новый репозиторий: `adambereg/20251112go2asia`
7. Выберите ветку: `main` (или нужную ветку)
8. Настройте **Build settings**:
   - **Build command:** `pnpm build` (или `cd apps/go2asia-pwa-shell && pnpm build`)
   - **Publish directory:** `apps/go2asia-pwa-shell/.next` (или нужный путь)
9. Сохраните настройки

### 3.2 Перепривязка Staging сайта

1. Найдите ваш Staging сайт в Netlify Dashboard
2. Перейдите в **Site settings → Build & deploy → Continuous Deployment**
3. Если сайт уже привязан к старому репо:
   - Нажмите **Unlink** (или **Change site name**)
   - Затем **Link to Git provider**
4. Выберите новый репозиторий: `adambereg/20251112go2asia`
5. Выберите ветку: `main`
6. Настройте **Build settings** (аналогично Preview)
7. Сохраните настройки

### 3.3 Перепривязка Production сайта

1. Найдите ваш Production сайт в Netlify Dashboard
2. Перейдите в **Site settings → Build & deploy → Continuous Deployment**
3. Перепривяжите к новому репозиторию (аналогично Staging)
4. **Важно:** Убедитесь что выбрана правильная ветка для production

### 3.4 Проверка Site ID

После перепривязки проверьте Site ID:

1. В каждом сайте перейдите в **Site settings → General → Site details**
2. Скопируйте **Site ID**
3. Убедитесь что соответствующий секрет в GitHub обновлён:
   - `NETLIFY_PREVIEW_SITE_ID`
   - `NETLIFY_STAGING_SITE_ID`
   - `NETLIFY_PRODUCTION_SITE_ID`

**Примечание:** Site ID обычно не меняется при перепривязке, но лучше проверить.

---

## Шаг 4: Cloudflare Workers — проверка конфигурации

### 4.1 Проверка wrangler.toml

Убедитесь что в каждом сервисе файл `wrangler.toml` содержит правильные настройки:

**Пример для staging:**
```toml
name = "go2asia-content-service"
compatibility_date = "2024-01-01"

[env.staging]
name = "go2asia-content-service-staging"
routes = [
  { pattern = "content-staging.go2asia.space/*", zone_name = "go2asia.space" }
]

[env.production]
name = "go2asia-content-service"
routes = [
  { pattern = "content.go2asia.space/*", zone_name = "go2asia.space" }
]
```

**Проверьте:**
- `name` для каждого окружения
- `routes` соответствуют вашим доменам
- `zone_name` правильный

### 4.2 Проверка секретов в Cloudflare Workers

Секреты в Cloudflare Workers хранятся отдельно от GitHub и не требуют миграции. Однако убедитесь что они настроены:

1. Откройте [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Перейдите в **Workers & Pages**
3. Для каждого Worker проверьте **Settings → Variables and Secrets**
4. Убедитесь что все секреты на месте:
   - `DATABASE_URL`
   - `CLERK_SECRET_KEY`
   - `CLERK_WEBHOOK_SECRET`
   - `SERVICE_JWT_SECRET`
   - И другие необходимые секреты

**Примечание:** Секреты в Cloudflare Workers не зависят от GitHub репозитория и остаются прежними.

### 4.3 Проверка GitHub Actions для Cloudflare

Убедитесь что в `.github/workflows/staging-deploy.yml` и `.github/workflows/production-deploy.yml` используются правильные секреты:

```yaml
- name: Deploy API Gateway to Cloudflare (staging)
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_STAGING_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_STAGING_ACCOUNT_ID }}
    workingDirectory: apps/api-gateway
    command: deploy
```

**Проверьте:**
- Имена секретов совпадают с теми, что в GitHub Secrets
- `workingDirectory` указывает на правильные директории

---

## Шаг 5: Clerk — проверка webhook'ов

### 5.1 Проверка Webhook URLs

Если у вас настроены Clerk webhook'и, которые указывают на GitHub репозиторий или используют GitHub Actions:

1. Откройте [Clerk Dashboard](https://dashboard.clerk.com/)
2. Перейдите в **Webhooks**
3. Проверьте **Endpoint URL** для каждого webhook'а
4. Если webhook'и указывают на Cloudflare Workers или прямые URL — ничего менять не нужно
5. Если webhook'и используют GitHub Actions или GitHub-specific URLs — обновите их

**Примечание:** Обычно Clerk webhook'и указывают на Cloudflare Workers или прямые endpoints, которые не зависят от GitHub репозитория.

### 5.2 Проверка секретов Clerk

Убедитесь что секреты Clerk добавлены в:
- GitHub Secrets (если используются в CI/CD)
- Cloudflare Workers Secrets (для Auth Service)

---

## Шаг 6: Neon — проверка баз данных

### 6.1 Проверка Connection Strings

Connection strings Neon не зависят от GitHub репозитория и остаются прежними. Просто убедитесь что они добавлены в GitHub Secrets:

1. Откройте [Neon Console](https://console.neon.tech/)
2. Для каждого проекта (staging, production) скопируйте **Connection String**
3. Убедитесь что они добавлены в GitHub Secrets:
   - `STAGING_DATABASE_URL`
   - `PRODUCTION_DATABASE_URL`

### 6.2 Проверка миграций

После первого деплоя проверьте что миграции применяются:

1. Запустите staging деплой
2. Проверьте логи миграций в GitHub Actions
3. Проверьте статус миграций в Neon Console

---

## Шаг 7: Проверка workflows

### 7.1 Проверка имен секретов

Убедитесь что имена секретов в workflows совпадают с теми, что вы добавили в GitHub Secrets:

**Проверьте файлы:**
- `.github/workflows/preview-deploy.yml`
- `.github/workflows/staging-deploy.yml`
- `.github/workflows/production-deploy.yml`

**Пример проверки:**
```yaml
# Если в workflow используется:
NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}

# То в GitHub Secrets должно быть:
NETLIFY_AUTH_TOKEN = <значение>
```

### 7.2 Проверка путей деплоя

Убедитесь что пути в workflows соответствуют структуре нового репозитория:

**Проверьте:**
- `workingDirectory` для Cloudflare Workers
- `--dir` для Netlify деплоя
- Пути к тестам и скриптам

---

## Шаг 8: Тестовый деплой

### 8.1 Тест Preview деплоя

1. Создайте тестовый PR в новом репозитории
2. Проверьте что запускается workflow `preview-deploy.yml`
3. Проверьте что деплой на Netlify проходит успешно
4. Проверьте что preview URL доступен

### 8.2 Тест Staging деплоя

1. Сделайте push в ветку `main`
2. Проверьте что запускается workflow `staging-deploy.yml`
3. Проверьте что:
   - Миграции применяются успешно
   - Cloudflare Workers деплоятся
   - Netlify деплоится
   - Smoke tests проходят

### 8.3 Тест Production деплоя

1. Запустите production workflow вручную (`workflow_dispatch`)
2. Проверьте что все шаги проходят успешно
3. Проверьте что production сайт обновляется

---

## Чеклист миграции

### GitHub
- [ ] Все секреты скопированы из старого репо в новый
- [ ] Окружения `staging` и `production` созданы
- [ ] Секреты окружений добавлены (если нужны)

### Netlify
- [ ] Preview сайт перепривязан к новому репо
- [ ] Staging сайт перепривязан к новому репо
- [ ] Production сайт перепривязан к новому репо
- [ ] Site ID проверены и обновлены в GitHub Secrets

### Cloudflare
- [ ] `wrangler.toml` файлы проверены
- [ ] Секреты в Cloudflare Workers проверены
- [ ] GitHub Actions используют правильные секреты

### Clerk
- [ ] Webhook URLs проверены (если применимо)
- [ ] Секреты Clerk добавлены в GitHub и Cloudflare

### Neon
- [ ] Connection strings добавлены в GitHub Secrets
- [ ] Миграции проверены после первого деплоя

### Тестирование
- [ ] Preview деплой протестирован
- [ ] Staging деплой протестирован
- [ ] Production деплой протестирован (опционально)

---

## Troubleshooting

### Проблема: GitHub Actions не видит секреты

**Решение:**
1. Проверьте что секреты добавлены в правильный репозиторий
2. Проверьте что имена секретов точно совпадают (регистр важен)
3. Проверьте что секреты не находятся в удалённых окружениях, если они нужны на уровне репозитория

### Проблема: Netlify не деплоится

**Решение:**
1. Проверьте что сайт перепривязан к новому репо
2. Проверьте что `NETLIFY_AUTH_TOKEN` и `NETLIFY_SITE_ID` правильные
3. Проверьте логи в Netlify Dashboard → Deploys

### Проблема: Cloudflare Workers не деплоятся

**Решение:**
1. Проверьте что `CLOUDFLARE_API_TOKEN` имеет права на деплой Workers
2. Проверьте что `CLOUDFLARE_ACCOUNT_ID` правильный
3. Проверьте что `wrangler.toml` файлы корректны
4. Проверьте логи в GitHub Actions

### Проблема: Миграции не применяются

**Решение:**
1. Проверьте что `DATABASE_URL` правильный в GitHub Secrets
2. Проверьте что миграции существуют в репозитории
3. Проверьте логи миграций в GitHub Actions

---

## Дополнительные ресурсы

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Netlify Continuous Deployment](https://docs.netlify.com/site-deploys/create-deploys/)
- [Cloudflare Workers Deployment](https://developers.cloudflare.com/workers/wrangler/commands/#deploy)
- [Neon Connection Strings](https://neon.tech/docs/connect/connect-from-any-app)

---

**Последнее обновление:** 2025-11-12

