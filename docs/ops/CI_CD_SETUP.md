# CI/CD Setup Guide

## Обзор

Проект использует GitHub Actions для автоматизации CI/CD процессов. Все workflows находятся в `.github/workflows/`.

## Workflows

### 1. PR Checks (`.github/workflows/pr-checks.yml`)

Запускается при создании Pull Request в `main`.

**Jobs:**
- `lint-and-build` - проверка линтинга, типов и сборка
- `validate-openapi` - валидация OpenAPI спецификаций через Spectral
- `generate-and-check` - генерация типов/SDK и проверка изменений
- `check-jwt-libraries` - проверка использования только `jose` для JWT

**Требования:**
- Все проверки должны пройти успешно для merge PR

### 2. Preview Deploy (`.github/workflows/preview-deploy.yml`)

Автоматически деплоит preview версию для каждого PR.

**Особенности:**
- Деплой на Netlify Preview
- Комментарий в PR с ссылкой на preview
- Используется для contract tests и E2E tests

**Secrets:**
- `NETLIFY_AUTH_TOKEN` - токен для Netlify API
- `NETLIFY_SITE_ID` - ID сайта в Netlify

### 3. Staging Deploy (`.github/workflows/staging-deploy.yml`)

Автоматический деплой на staging при push в `main`.

**Особенности:**
- Деплой API Gateway и сервисов на Cloudflare Workers
- Деплой PWA на Netlify (staging)
- Запуск миграций БД
- Smoke tests после деплоя

**Secrets:**
- `CLOUDFLARE_API_TOKEN` - токен для Cloudflare API
- `CLOUDFLARE_ACCOUNT_ID` - ID аккаунта Cloudflare
- `NETLIFY_AUTH_TOKEN` - токен для Netlify API
- `NETLIFY_STAGING_SITE_ID` - ID staging сайта
- `STAGING_DATABASE_URL` - URL БД для staging

**Environment:**
- `staging` - защищённое окружение с секретами

### 4. Production Deploy (`.github/workflows/production-deploy.yml`)

Ручной деплой на production через `workflow_dispatch`.

**Особенности:**
- Требует подтверждения (ввод "deploy")
- Валидация версии (семантическое версионирование)
- Деплой на production окружения
- Rollback при неудачных smoke tests
- Создание GitHub Release

**Inputs:**
- `version` - версия для деплоя (например, v0.1.0)
- `confirm` - подтверждение (должно быть "deploy")

**Secrets:**
- `CLOUDFLARE_API_TOKEN` - токен для Cloudflare API
- `CLOUDFLARE_ACCOUNT_ID` - ID аккаунта Cloudflare
- `NETLIFY_AUTH_TOKEN` - токен для Netlify API
- `NETLIFY_PRODUCTION_SITE_ID` - ID production сайта
- `PRODUCTION_DATABASE_URL` - URL БД для production

**Environment:**
- `production` - защищённое окружение с секретами

## Настройка Secrets

### GitHub Secrets

1. Перейдите в Settings → Secrets and variables → Actions
2. Добавьте следующие secrets:

**Netlify:**
- `NETLIFY_AUTH_TOKEN` - получить в Netlify Dashboard → User settings → Applications
- `NETLIFY_SITE_ID` - получить в Site settings → General → Site details
- `NETLIFY_STAGING_SITE_ID` - ID staging сайта
- `NETLIFY_PRODUCTION_SITE_ID` - ID production сайта

**Cloudflare:**
- `CLOUDFLARE_API_TOKEN` - создать в Cloudflare Dashboard → My Profile → API Tokens
- `CLOUDFLARE_ACCOUNT_ID` - найти в Cloudflare Dashboard → Right sidebar

**Database:**
- `STAGING_DATABASE_URL` - connection string для staging БД
- `PRODUCTION_DATABASE_URL` - connection string для production БД

### Environment Protection

Настройте protection rules для `staging` и `production` environments:

1. Settings → Environments → Create environment
2. Добавьте required reviewers для production
3. Настройте deployment branches (только `main` для production)

## Тестирование

### E2E Tests

E2E тесты используют Playwright и находятся в `apps/go2asia-pwa-shell/tests/`.

**Запуск локально:**
```bash
cd apps/go2asia-pwa-shell
pnpm test:e2e
```

**Запуск с UI:**
```bash
pnpm test:e2e:ui
```

### Smoke Tests

Smoke tests проверяют базовую работоспособность после деплоя.

**Запуск:**
```bash
pnpm test:smoke:staging
pnpm test:smoke:prod
```

## Troubleshooting

### Preview Deploy не работает

1. Проверьте наличие `NETLIFY_AUTH_TOKEN` и `NETLIFY_SITE_ID` в secrets
2. Убедитесь что Netlify site настроен правильно
3. Проверьте логи в GitHub Actions

### Staging Deploy падает

1. Проверьте все required secrets
2. Убедитесь что Cloudflare Workers настроены
3. Проверьте доступность staging БД
4. Проверьте логи миграций

### Production Deploy требует подтверждения

Это нормально - production деплой защищён и требует:
- Подтверждения через input "deploy"
- Валидной версии
- Прохождения всех проверок

## Best Practices

1. **Всегда проверяйте PR checks перед merge**
2. **Используйте preview deployments для тестирования**
3. **Не деплойте в production без тестирования на staging**
4. **Следите за smoke tests после деплоя**
5. **Используйте semantic versioning для production releases**

