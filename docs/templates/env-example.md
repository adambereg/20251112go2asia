# Шаблоны переменных окружения

## Frontend (apps/go2asia-pwa-shell/.env.example)

```bash
# API
NEXT_PUBLIC_API_URL=https://api.go2asia.space
NEXT_PUBLIC_API_STAGING_URL=https://api-staging.go2asia.space

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Environment
NODE_ENV=development
NEXT_PUBLIC_ENV=development

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
```

## API Gateway (services/api-gateway/.env.example)

```bash
# Environment
NODE_ENV=development

# Service URLs (staging)
AUTH_SERVICE_URL=https://auth-service-staging.workers.dev
CONTENT_SERVICE_URL=https://content-service-staging.workers.dev
TOKEN_SERVICE_URL=https://token-service-staging.workers.dev
REFERRAL_SERVICE_URL=https://referral-service-staging.workers.dev

# Secrets (устанавливаются через Cloudflare Dashboard или wrangler secret)
# CLERK_SECRET_KEY=sk_test_...
# SERVICE_JWT_SECRET=...
```

## Auth Service (services/auth-service/.env.example)

```bash
# Environment
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Clerk
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Service JWT
SERVICE_JWT_SECRET=...

# Secrets устанавливаются через:
# wrangler secret put DATABASE_URL --env staging
# wrangler secret put CLERK_SECRET_KEY --env staging
# wrangler secret put CLERK_WEBHOOK_SECRET --env staging
# wrangler secret put SERVICE_JWT_SECRET --env staging
```

## Content Service (services/content-service/.env.example)

```bash
# Environment
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Service JWT
SERVICE_JWT_SECRET=...

# Secrets устанавливаются через:
# wrangler secret put DATABASE_URL --env staging
# wrangler secret put SERVICE_JWT_SECRET --env staging
```

## Token Service (services/token-service/.env.example)

```bash
# Environment
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Service JWT
SERVICE_JWT_SECRET=...

# Secrets устанавливаются через:
# wrangler secret put DATABASE_URL --env staging
# wrangler secret put SERVICE_JWT_SECRET --env staging
```

## Referral Service (services/referral-service/.env.example)

```bash
# Environment
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Service JWT
SERVICE_JWT_SECRET=...

# Secrets устанавливаются через:
# wrangler secret put DATABASE_URL --env staging
# wrangler secret put SERVICE_JWT_SECRET --env staging
```

---

## Правила хранения секретов

### Netlify (Frontend)

1. **Netlify Dashboard** → Site settings → Environment variables
2. Добавить переменные для каждого окружения:
   - **Production:** `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Deploy previews:** Автоматически наследуют из production или можно переопределить

### Cloudflare (Backend)

1. **Через Wrangler CLI:**
   ```bash
   wrangler secret put SECRET_NAME --env production
   wrangler secret put SECRET_NAME --env staging
   ```

2. **Через Cloudflare Dashboard:**
   - Workers & Pages → Выбрать Worker → Settings → Variables and Secrets
   - Добавить Secret для каждого окружения

### Neon (Database)

1. **Neon Dashboard** → Project → Settings → Connection String
2. Скопировать connection string
3. Добавить как Secret в Cloudflare:
   ```bash
   wrangler secret put DATABASE_URL --env production
   ```

---

## Проверка секретов перед деплоем

Создать скрипт `scripts/check-secrets.sh`:

```bash
#!/bin/bash

# Проверка секретов для production
echo "Checking production secrets..."

# Проверка через wrangler
wrangler secret list --env production

# Проверка через Cloudflare API (если нужно)
# curl -X GET "https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/{script_name}/secrets" \
#   -H "Authorization: Bearer {api_token}"
```

---

## Ротация секретов

**План ротации:**
- JWT секреты: каждые 90 дней
- Database пароли: каждые 180 дней
- Clerk секреты: по необходимости (при компрометации)

**Процесс:**
1. Сгенерировать новый секрет
2. Добавить в staging
3. Протестировать
4. Добавить в production
5. Удалить старый секрет через 7 дней (grace period)

