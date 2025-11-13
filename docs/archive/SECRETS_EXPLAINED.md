# Разница между секретами в GitHub и Cloudflare Workers

**Дата:** 2025-11-13  
**Статус:** Важное объяснение для миграции

---

## Обзор

Секреты для баз данных нужны в **двух разных местах** для разных целей:

1. **GitHub Secrets** — для CI/CD workflows (миграции, seeds)
2. **Cloudflare Workers Secrets** — для работы приложения (подключение к БД)

---

## GitHub Secrets — для CI/CD

### Где используются:

В GitHub Actions workflows для запуска миграций и seeds:

```yaml
# .github/workflows/staging-deploy.yml
- name: Run database migrations (staging)
  run: |
    cd services/content-service && DATABASE_URL=${{ secrets.STAGING_DATABASE_URL }} pnpm db:migrate:up
```

### Какие секреты нужны:

- `STAGING_DATABASE_URL` — для staging миграций и seeds
- `PRODUCTION_DATABASE_URL` — для production миграций и seeds

### Зачем нужны:

- Запуск миграций БД перед деплоем
- Запуск seed файлов для начальных данных
- Проверка статуса миграций

### Где добавить:

GitHub → Settings → Secrets and variables → Actions → New repository secret

---

## Cloudflare Workers Secrets — для работы приложения

### Где используются:

В самих Cloudflare Workers для подключения к БД во время выполнения:

```typescript
// services/content-service/src/utils/db.ts
const sql = neon(process.env.DATABASE_URL);
```

### Какие секреты нужны:

- `DATABASE_URL` — для каждого Worker/deployment (staging и production)

**Важно:** Имя секрета одинаковое (`DATABASE_URL`), но значения разные для staging и production!

### Зачем нужны:

- Подключение к БД из Worker во время выполнения запросов
- Работа приложения (не миграции!)

### Где добавить:

Cloudflare Dashboard → Workers & Pages → Выбрать Worker → Settings → Variables and Secrets → Add secret

---

## Сравнение

| Место | Секреты | Назначение | Когда используются |
|-------|---------|------------|-------------------|
| **GitHub Secrets** | `STAGING_DATABASE_URL`<br>`PRODUCTION_DATABASE_URL` | CI/CD workflows | При деплое (миграции, seeds) |
| **Cloudflare Workers** | `DATABASE_URL` (staging)<br>`DATABASE_URL` (production) | Работа приложения | При каждом запросе к Worker |

---

## Пример настройки

### 1. GitHub Secrets (для CI/CD):

```
STAGING_DATABASE_URL = postgresql://neondb_owner:***@ep-staging-xxx-pooler.us-east-1.aws.neon.tech/neondb?...
PRODUCTION_DATABASE_URL = postgresql://neondb_owner:***@ep-production-xxx-pooler.us-east-1.aws.neon.tech/go2asia?...
```

**Используются в:**
- `.github/workflows/staging-deploy.yml` → миграции staging
- `.github/workflows/production-deploy.yml` → миграции production

### 2. Cloudflare Workers Secrets (для приложения):

**Для staging Worker/deployment:**
```
DATABASE_URL = postgresql://neondb_owner:***@ep-staging-xxx-pooler.us-east-1.aws.neon.tech/neondb?...
```

**Для production Worker/deployment:**
```
DATABASE_URL = postgresql://neondb_owner:***@ep-production-xxx-pooler.us-east-1.aws.neon.tech/go2asia?...
```

**Используются в:**
- `services/content-service/src/utils/db.ts` → подключение к БД
- `services/token-service/src/utils/db.ts` → подключение к БД
- `services/referral-service/src/utils/db.ts` → подключение к БД

---

## Почему нужны оба?

### GitHub Secrets нужны для:

- ✅ Запуска миграций перед деплоем
- ✅ Запуска seed файлов
- ✅ Проверки статуса миграций

**Без них:** Миграции не будут применяться автоматически при деплое.

### Cloudflare Workers Secrets нужны для:

- ✅ Подключения к БД из Worker
- ✅ Выполнения SQL запросов
- ✅ Работы приложения

**Без них:** Workers не смогут подключиться к БД и будут возвращать ошибки.

---

## Чеклист настройки

### GitHub Secrets:

- [ ] `STAGING_DATABASE_URL` — connection string из staging проекта Neon
- [ ] `PRODUCTION_DATABASE_URL` — connection string из production проекта Neon

### Cloudflare Workers Secrets:

Для каждого сервиса (Content, Token, Referral):

- [ ] **Staging Worker/deployment:**
  - [ ] `DATABASE_URL` = staging connection string
  - [ ] `SERVICE_JWT_SECRET` = общий секрет

- [ ] **Production Worker/deployment:**
  - [ ] `DATABASE_URL` = production connection string
  - [ ] `SERVICE_JWT_SECRET` = общий секрет

---

## Важные замечания

1. **Значения могут быть одинаковыми** (если используете один и тот же connection string), но это **разные секреты в разных местах**.

2. **GitHub Secrets** используются только в CI/CD, не передаются в Workers.

3. **Cloudflare Workers Secrets** используются только в Workers, не доступны в GitHub Actions.

4. **Имена разные:**
   - GitHub: `STAGING_DATABASE_URL`, `PRODUCTION_DATABASE_URL`
   - Cloudflare: `DATABASE_URL` (для каждого окружения отдельно)

---

## Troubleshooting

### Проблема: Миграции не применяются

**Проверьте:** GitHub Secrets (`STAGING_DATABASE_URL`, `PRODUCTION_DATABASE_URL`)

### Проблема: Workers не могут подключиться к БД

**Проверьте:** Cloudflare Workers Secrets (`DATABASE_URL` для каждого Worker/deployment)

---

**Последнее обновление:** 2025-11-13

