# 📋 Фаза 0 — Подробный план разработки

**Дата создания:** 2025-11-12  
**Статус:** Готов к реализации  
**Версия:** 1.0

> **Цель Фазы 0:** Создать инженерный фундамент проекта Go2Asia с чистыми контрактами, готовностью к масштабированию и избежанием всех ошибок предыдущей итерации.

---

## 📊 Обзор Фазы 0

### Пользовательские модули (9 модулей)
На Фазе 0 **не реализуются**, но готовится инфраструктура для их будущей разработки:

1. **Guru Asia** — навигационный хаб "рядом с тобой"
2. **Atlas Asia** — база знаний о локациях
3. **Pulse Asia** — события и афиша
4. **Blog Asia** — медиацентр
5. **Rielt.Market Asia** — аренда жилья
6. **Russian Friendly Asia** — партнёрская программа
7. **Space Asia** — социальная сеть
8. **Connect Asia** — экономика и геймификация
9. **Quest Asia** — квесты и миссии

### Инфраструктурные сервисы
На Фазе 0 создаются базовые сервисы для поддержки всех модулей:

- **API Gateway** — единая точка входа для всех API
- **Auth Service** — авторизация и управление пользователями
- **Content Service** — базовый контентный API
- **Token Service** — учёт Points (off-chain)
- **Referral Service** — реферальная программа

---

## 📅 День 1: Инициализация монорепо

### 🎯 Цель дня
Создать базовую структуру монорепозитория с правильной организацией капсул и настроенными инструментами разработки.

### ✅ Задачи

#### 1.1. Инициализация монорепо
- [ ] Создать репозиторий `go2asia-monorepo`
- [ ] Инициализировать `pnpm` workspace
- [ ] Настроить `Turborepo` для кэширования сборок
- [ ] Создать корневой `package.json` с workspace конфигурацией
- [ ] Настроить `.gitignore` для монорепо

**Структура:**
```
go2asia-monorepo/
├── package.json          # Корневой package.json с workspaces
├── pnpm-workspace.yaml   # Конфигурация pnpm workspaces
├── turbo.json            # Конфигурация Turborepo
├── .gitignore
├── .github/
│   └── workflows/        # CI/CD workflows
├── apps/                 # Приложения (фронтенды)
├── services/             # Микросервисы (бэкенды)
├── packages/             # Общие пакеты
└── docs/                 # Документация
```

#### 1.2. Структура капсул

**Apps (фронтенды):**
- [ ] Создать `apps/go2asia-pwa-shell/` — основной PWA shell
- [ ] Создать `apps/api-gateway/` — API Gateway (Cloudflare Worker)

**Services (бэкенды):**
- [ ] Создать `services/auth-service/` — сервис авторизации
- [ ] Создать `services/content-service/` — контентный сервис
- [ ] Создать `services/token-service/` — сервис токенов
- [ ] Создать `services/referral-service/` — реферальный сервис

**Packages (общие пакеты):**
- [ ] Создать `packages/ui/` — дизайн-система
- [ ] Создать `packages/types/` — TypeScript типы (будут генерироваться)
- [ ] Создать `packages/sdk/` — API клиент (будет генерироваться)
- [ ] Создать `packages/config/` — общие конфиги (ESLint, Prettier, TS)
- [ ] Создать `packages/logger/` — единый логгер
- [ ] Создать `packages/schemas/` — Zod схемы

#### 1.3. Настройка базовых скриптов

**Корневой `package.json`:**
```json
{
  "name": "go2asia-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "services/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "clean": "turbo run clean",
    "gen:types": "orval --types",
    "gen:sdk": "orval --sdk",
    "gen:all": "pnpm gen:types && pnpm gen:sdk",
    "validate:openapi": "spectral lint docs/openapi/**/*.yaml"
  },
  "devDependencies": {
    "@orval/core": "latest",
    "@stoplight/spectral-cli": "latest",
    "turbo": "latest",
    "typescript": "^5.0.0"
  }
}
```

#### 1.4. Настройка линтеров

- [ ] Создать `packages/config/eslint-config/` с базовыми правилами
- [ ] Создать `packages/config/prettier-config/` с форматированием
- [ ] Создать `packages/config/tsconfig/` с базовыми TS настройками
- [ ] Настроить ESLint правило запрета межсервисных импортов:
  ```js
  // .eslintrc.cjs
  "no-restricted-imports": ["error", {
    "patterns": ["../../services/*", "../../apps/*"]
  }]
  ```
- [ ] Настроить `lint-staged` для pre-commit хуков

#### 1.5. Каркас Next.js (PWA Shell)

- [ ] Инициализировать Next.js 15 в `apps/go2asia-pwa-shell/`
- [ ] Настроить App Router
- [ ] Создать базовую структуру:
  ```
  apps/go2asia-pwa-shell/
  ├── app/
  │   ├── (public)/        # Публичные страницы (SSR/SSG)
  │   │   ├── atlas/
  │   │   ├── blog/
  │   │   └── pulse/
  │   ├── (private)/       # Приватные страницы (SPA)
  │   │   ├── connect/
  │   │   └── profile/
  │   ├── layout.tsx
  │   └── page.tsx
  ├── components/
  ├── lib/
  └── package.json
  ```
- [ ] Настроить Tailwind CSS + shadcn/ui
- [ ] Создать базовый layout с навигацией

#### 1.6. Каркас API Gateway

- [ ] Инициализировать Cloudflare Worker в `apps/api-gateway/`
- [ ] Установить Hono для роутинга
- [ ] Создать базовую структуру:
  ```
  apps/api-gateway/
  ├── src/
  │   ├── index.ts         # Entry point
  │   ├── routes/          # Маршруты
  │   ├── middleware/      # Middleware (auth, validation, logging)
  │   └── utils/           # Утилиты (proxy, error handling)
  ├── wrangler.toml
  └── package.json
  ```
- [ ] Настроить базовый роутинг к сервисам

### 📝 Результат дня
✅ Базовая структура монорепо готова  
✅ Все капсулы созданы с минимальным каркасом  
✅ Линтеры и форматтеры настроены  
✅ PWA Shell и API Gateway имеют базовую структуру

---

## 📅 День 2: OpenAPI каркас

### 🎯 Цель дня
Описываем все публичные API контракты в OpenAPI спецификациях и настраиваем автоматическую генерацию типов и SDK.

### ✅ Задачи

#### 2.1. Структура OpenAPI спецификаций

- [ ] Создать директорию `docs/openapi/`
- [ ] Создать файлы спецификаций для каждого сервиса:
  - [ ] `content.yaml` — Content Service API
  - [ ] `auth.yaml` — Auth Service API
  - [ ] `token.yaml` — Token Service API
  - [ ] `referral.yaml` — Referral Service API

#### 2.2. Content Service API (`content.yaml`)

**Endpoints:**
- [ ] `GET /v1/countries` — список стран
- [ ] `GET /v1/countries/{id}` — детали страны
- [ ] `GET /v1/cities` — список городов (с фильтрами)
- [ ] `GET /v1/cities/{id}` — детали города
- [ ] `GET /v1/places` — список мест (с фильтрами)
- [ ] `GET /v1/places/{id}` — детали места
- [ ] `GET /v1/events` — список событий
- [ ] `GET /v1/events/{id}` — детали события
- [ ] `GET /v1/articles` — список статей
- [ ] `GET /v1/articles/{slug}` — детали статьи

**Схемы данных:**
- [ ] `Country` — модель страны
- [ ] `City` — модель города
- [ ] `Place` — модель места
- [ ] `Event` — модель события
- [ ] `Article` — модель статьи
- [ ] `ErrorResponse` — единый формат ошибок

#### 2.3. Auth Service API (`auth.yaml`)

**Endpoints:**
- [ ] `GET /v1/profile` — профиль текущего пользователя (auth required)
- [ ] `POST /v1/webhook/clerk` — webhook от Clerk (создание/обновление пользователя)

**Схемы данных:**
- [ ] `UserProfile` — профиль пользователя
- [ ] `ClerkWebhook` — структура webhook от Clerk

#### 2.4. Token Service API (`token.yaml`)

**Endpoints:**
- [ ] `GET /v1/balance` — баланс Points (auth required)
- [ ] `GET /v1/transactions` — история транзакций (auth required)
- [ ] `POST /v1/add` — начисление Points (internal, service-to-service)
- [ ] `POST /v1/subtract` — списание Points (internal, service-to-service)

**Схемы данных:**
- [ ] `Balance` — баланс пользователя
- [ ] `Transaction` — транзакция
- [ ] `AddPointsRequest` — запрос на начисление
- [ ] `SubtractPointsRequest` — запрос на списание

#### 2.5. Referral Service API (`referral.yaml`)

**Endpoints:**
- [ ] `GET /v1/stats` — статистика рефералов (auth required)
- [ ] `GET /v1/tree` — дерево рефералов (auth required)
- [ ] `POST /v1/register` — регистрация по реферальному коду (internal)

**Схемы данных:**
- [ ] `ReferralStats` — статистика рефералов
- [ ] `ReferralTree` — дерево рефералов
- [ ] `RegisterReferralRequest` — запрос регистрации

#### 2.6. Настройка Orval

- [ ] Установить `@orval/core` и зависимости
- [ ] Создать `orval.config.ts`:
  ```typescript
  export default {
    content: {
      input: './docs/openapi/content.yaml',
      output: {
        target: './packages/sdk/src/content.ts',
        client: 'react-query',
        mode: 'tags-split',
      },
      types: {
        output: './packages/types/src/content.ts',
      },
    },
    auth: {
      input: './docs/openapi/auth.yaml',
      output: {
        target: './packages/sdk/src/auth.ts',
        client: 'react-query',
      },
      types: {
        output: './packages/types/src/auth.ts',
      },
    },
    token: {
      input: './docs/openapi/token.yaml',
      output: {
        target: './packages/sdk/src/token.ts',
        client: 'react-query',
      },
      types: {
        output: './packages/types/src/token.ts',
      },
    },
    referral: {
      input: './docs/openapi/referral.yaml',
      output: {
        target: './packages/sdk/src/referral.ts',
        client: 'react-query',
      },
      types: {
        output: './packages/types/src/referral.ts',
      },
    },
  };
  ```

#### 2.7. Проверка генерации

- [ ] Запустить `pnpm gen:all`
- [ ] Проверить, что типы созданы в `packages/types/`
- [ ] Проверить, что SDK создан в `packages/sdk/`
- [ ] Убедиться, что типы корректны и компилируются

#### 2.8. Настройка валидации OpenAPI

- [ ] Установить `@stoplight/spectral-cli`
- [ ] Создать `spectral.yaml` с правилами валидации
- [ ] Проверить все спецификации: `pnpm validate:openapi`

### 📝 Результат дня
✅ Все публичные API описаны в OpenAPI  
✅ Типы и SDK генерируются автоматически  
✅ Валидация OpenAPI настроена  
✅ Генерация проверена и работает

---

## 📅 День 3: Безопасность и логирование

### 🎯 Цель дня
Настроить безопасность (JWT, валидация), единое логирование с трассировкой и health checks для всех сервисов.

### ✅ Задачи

#### 3.1. Единый логгер (`packages/logger`)

- [ ] Создать пакет `packages/logger/`
- [ ] Реализовать функции:
  ```typescript
  // packages/logger/src/index.ts
  export function generateRequestId(): string {
    return crypto.randomUUID();
  }

  export function logRequest(
    requestId: string,
    method: string,
    path: string,
    duration: number,
    status: number
  ) {
    console.log(JSON.stringify({
      requestId,
      method,
      path,
      duration,
      status,
      timestamp: new Date().toISOString(),
    }));
  }

  export function logError(
    requestId: string,
    error: Error,
    context?: Record<string, unknown>
  ) {
    console.error(JSON.stringify({
      requestId,
      level: 'error',
      error: {
        message: error.message,
        stack: error.stack,
      },
      context,
      timestamp: new Date().toISOString(),
    }));
  }
  ```
- [ ] Экспортировать типы для использования в сервисах

#### 3.2. JWT утилиты (`packages/logger/src/jwt.ts`)

- [ ] Установить `jose` (единственная JWT библиотека)
- [ ] Создать функции для работы с JWT:
  ```typescript
  import * as jose from 'jose';

  export async function verifyJWT(token: string, secret: string) {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload;
  }

  export async function signJWT(payload: object, secret: string) {
    const secretKey = new TextEncoder().encode(secret);
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(secretKey);
  }
  ```
- [ ] Запретить другие JWT библиотеки в `package.json`:
  ```json
  {
    "pnpm": {
      "overrides": {
        "jsonwebtoken": "npm:jose@latest",
        "@tsndr/cloudflare-worker-jwt": "npm:jose@latest"
      }
    }
  }
  ```

#### 3.3. Zod валидация в API Gateway

- [ ] Установить `zod` в `apps/api-gateway/`
- [ ] Создать middleware для валидации:
  ```typescript
  // apps/api-gateway/src/middleware/validation.ts
  import { z } from 'zod';
  import { Context } from 'hono';

  export function validateBody<T extends z.ZodType>(schema: T) {
    return async (c: Context, next: () => Promise<void>) => {
      try {
        const body = await c.req.json();
        const validated = schema.parse(body);
        c.set('validatedBody', validated);
        await next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          return c.json({
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid request parameters',
              details: error.errors,
            },
          }, 400);
        }
        throw error;
      }
    };
  }
  ```
- [ ] Применить валидацию к POST/PUT endpoints

#### 3.4. Трассировка запросов (X-Request-Id)

- [ ] Добавить middleware в API Gateway:
  ```typescript
  // apps/api-gateway/src/middleware/tracing.ts
  import { generateRequestId } from '@go2asia/logger';

  export async function tracingMiddleware(c: Context, next: () => Promise<void>) {
    const requestId = c.req.header('X-Request-Id') || generateRequestId();
    c.set('requestId', requestId);
    c.header('X-Request-Id', requestId);
    
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    
    logRequest(requestId, c.req.method, c.req.path, duration, c.res.status);
  }
  ```
- [ ] Добавить передачу `X-Request-Id` в проксируемых запросах к сервисам

#### 3.5. Health и Ready endpoints

**В каждом сервисе:**
- [ ] Реализовать `/health`:
  ```typescript
  app.get('/health', (c) => {
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'content-service',
    });
  });
  ```

- [ ] Реализовать `/ready`:
  ```typescript
  app.get('/ready', async (c) => {
    try {
      // Проверка подключения к БД
      await db.query('SELECT 1');
      return c.json({ status: 'ready' });
    } catch (error) {
      return c.json({
        status: 'not ready',
        error: error.message,
      }, 503);
    }
  });
  ```

**Сервисы для реализации:**
- [ ] `services/auth-service/`
- [ ] `services/content-service/`
- [ ] `services/token-service/`
- [ ] `services/referral-service/`
- [ ] `apps/api-gateway/`

#### 3.6. Обработка ошибок

- [ ] Создать единый формат ошибок в API Gateway:
  ```typescript
  // apps/api-gateway/src/utils/errors.ts
  export function createErrorResponse(
    code: string,
    message: string,
    traceId: string,
    key?: string,
    statusCode: number = 500
  ) {
    return {
      error: {
        code,
        message,
        traceId,
        ...(key && { key }),
      },
    };
  }
  ```
- [ ] Применить обработку ошибок ко всем маршрутам

### 📝 Результат дня
✅ Единый логгер с requestId создан  
✅ JWT работает только через `jose`  
✅ Zod валидация настроена в Gateway  
✅ Health/Ready endpoints реализованы  
✅ Трассировка запросов работает

---

## 📅 День 4: CI/CD Pipeline

### 🎯 Цель дня
Настроить автоматический CI/CD pipeline с проверками, тестами и деплоем на staging/prod.

### ✅ Задачи

#### 4.1. PR Pipeline (`.github/workflows/pr-checks.yml`)

- [ ] Создать workflow для проверки PR:
  ```yaml
  name: PR Checks

  on: [pull_request]

  jobs:
    lint-and-build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v2
        - uses: actions/setup-node@v4
          with:
            node-version: '20'
            cache: 'pnpm'
        
        - run: pnpm install
        - run: pnpm lint
        - run: pnpm typecheck
        - run: pnpm build

    validate-openapi:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - run: |
            npm install -g @stoplight/spectral-cli
            spectral lint docs/openapi/**/*.yaml

    generate-and-check:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v2
        - run: pnpm install
        - run: pnpm gen:all
        - run: |
            if [ -n "$(git diff --exit-code)" ]; then
              echo "Generated types/SDK differ from committed files"
              exit 1
            fi
  ```

#### 4.2. Contract Tests

- [ ] Установить `schemathesis` для contract тестов
- [ ] Добавить job в PR pipeline:
  ```yaml
  contract-tests:
    runs-on: ubuntu-latest
    needs: [deploy-preview]
    steps:
      - uses: actions/checkout@v4
      - run: |
          pip install schemathesis
          schemathesis run \
            --base-url ${{ env.PREVIEW_URL }} \
            --checks all \
            docs/openapi/content.yaml
  ```

#### 4.3. E2E Tests

- [ ] Установить Playwright в `apps/go2asia-pwa-shell/`
- [ ] Создать базовые smoke тесты:
  ```typescript
  // apps/go2asia-pwa-shell/tests/smoke.spec.ts
  import { test, expect } from '@playwright/test';

  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Go2Asia/);
  });

  test('health check works', async ({ request }) => {
    const response = await request.get('https://api.go2asia.space/health');
    expect(response.ok()).toBeTruthy();
  });
  ```
- [ ] Добавить job в PR pipeline:
  ```yaml
  e2e-tests:
    runs-on: ubuntu-latest
    needs: [deploy-preview]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm test:e2e
  ```

#### 4.4. Preview Deployments

- [ ] Настроить Netlify для preview deployments
- [ ] Создать workflow для деплоя превью:
  ```yaml
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --dir=apps/go2asia-pwa-shell/.next --prod=false
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
  ```

#### 4.5. Staging Deploy (автоматический)

- [ ] Создать workflow для staging:
  ```yaml
  name: Deploy to Staging

  on:
    push:
      branches: [main]

  jobs:
    deploy-staging:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v2
        - run: pnpm install
        - run: pnpm build
        - run: pnpm db:migrate:staging
        - run: pnpm deploy:staging
        - run: pnpm test:smoke:staging
  ```

#### 4.6. Production Deploy (ручной)

- [ ] Создать workflow для production:
  ```yaml
  name: Promote to Production

  on:
    workflow_dispatch:
      inputs:
        version:
          description: 'Version to deploy'
          required: true

  jobs:
    deploy-prod:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v2
        - run: pnpm install
        - run: pnpm build
        - run: pnpm db:migrate:prod
        - run: pnpm deploy:prod
        - run: pnpm test:smoke:prod
        - run: |
            if [ $? -ne 0 ]; then
              pnpm db:rollback:prod
              pnpm deploy:rollback:prod
            fi
  ```

### 📝 Результат дня
✅ PR pipeline работает с проверками  
✅ Preview deployments настроены  
✅ Staging деплой автоматический  
✅ Production деплой ручной с rollback

---

## 📅 День 5: Neon и данные

### 🎯 Цель дня
Настроить базу данных Neon PostgreSQL, миграции через Drizzle Kit, seed файлы и бэкапы.

### ✅ Задачи

#### 5.1. Настройка Neon

- [ ] Создать Neon проект для staging
- [ ] Создать Neon проект для production
- [ ] Получить connection strings для обоих окружений
- [ ] Добавить в `.env.example`:
  ```
  DATABASE_URL=postgresql://user:password@host/database
  ```

#### 5.2. Настройка Drizzle Kit

- [ ] Установить `drizzle-kit` и `drizzle-orm` в каждый сервис
- [ ] Создать `drizzle.config.ts` в каждом сервисе:
  ```typescript
  // services/content-service/drizzle.config.ts
  import type { Config } from 'drizzle-kit';

  export default {
    schema: './src/db/schema.ts',
    out: './migrations',
    driver: 'pg',
    dbCredentials: {
      connectionString: process.env.DATABASE_URL!,
    },
  } satisfies Config;
  ```
- [ ] Создать базовые схемы для каждого сервиса

#### 5.3. Миграции

**Content Service:**
- [ ] Создать схему для стран, городов, мест, событий, статей
- [ ] Сгенерировать первую миграцию: `pnpm db:migrate:generate`
- [ ] Проверить SQL файлы миграций

**Auth Service:**
- [ ] Создать схему для профилей пользователей
- [ ] Сгенерировать миграцию

**Token Service:**
- [ ] Создать схему для балансов и транзакций Points
- [ ] Сгенерировать миграцию

**Referral Service:**
- [ ] Создать схему для реферальных связей
- [ ] Сгенерировать миграцию

#### 5.4. Seed файлы

- [ ] Создать `seeds/` директорию в каждом сервисе
- [ ] Создать seed файлы в UTF-8:
  ```
  services/content-service/
  ├── seeds/
  │   ├── countries.sql
  │   ├── cities.sql
  │   └── places.sql
  ```
- [ ] Написать SQL seed файлы с тестовыми данными
- [ ] Проверить кодировку файлов (UTF-8)

#### 5.5. Команды для миграций

**В корневом `package.json`:**
```json
{
  "scripts": {
    "db:migrate:generate": "turbo run db:migrate:generate",
    "db:migrate:up": "turbo run db:migrate:up",
    "db:migrate:down": "turbo run db:migrate:down",
    "db:migrate:status": "turbo run db:migrate:status",
    "db:seed": "turbo run db:seed",
    "db:migrate:staging": "DATABASE_URL=$STAGING_DB_URL pnpm db:migrate:up",
    "db:migrate:prod": "DATABASE_URL=$PROD_DB_URL pnpm db:migrate:up",
    "db:rollback:prod": "DATABASE_URL=$PROD_DB_URL pnpm db:migrate:down"
  }
}
```

#### 5.6. Настройка бэкапов

- [ ] Включить Point-in-Time Recovery (PITR) в Neon
- [ ] Настроить автоматические бэкапы (каждые 24 часа)
- [ ] Настроить хранение бэкапов (минимум 30 дней)
- [ ] Создать документ `/docs/ops/BACKUP_RECOVERY.md` с инструкциями

#### 5.7. Тестирование rollback

- [ ] Применить миграции на staging
- [ ] Протестировать откат миграции (`db:migrate:down`)
- [ ] Проверить восстановление данных
- [ ] Задокументировать процесс в runbook

#### 5.8. CI проверка кодировки

- [ ] Добавить проверку UTF-8 в CI:
  ```yaml
  - name: Check seed encoding
    run: |
      file -bi services/*/seeds/*.sql | grep -q "charset=utf-8" || exit 1
  ```

### 📝 Результат дня
✅ Neon настроен для staging и production  
✅ Миграции работают через Drizzle Kit  
✅ Seed файлы созданы в UTF-8  
✅ Бэкапы настроены  
✅ Rollback протестирован

---

## 📅 День 6: Кэширование и алёрты

### 🎯 Цель дня
Настроить кэширование для публичных endpoints, алёрты Cloudflare и базовые runbooks.

### ✅ Задачи

#### 6.1. Кэш-матрица

- [ ] Создать документ `/docs/ops/CACHE_STRATEGY.md` с матрицей TTL
- [ ] Определить стратегии кэширования:
  - Публичные GET: `public, s-maxage=300, stale-while-revalidate=60`
  - Приватные GET: `no-store, no-cache, must-revalidate`

#### 6.2. Реализация кэширования в Gateway

- [ ] Добавить middleware для установки заголовков:
  ```typescript
  // apps/api-gateway/src/middleware/cache.ts
  export function cacheMiddleware(isPublic: boolean) {
    return async (c: Context, next: () => Promise<void>) => {
      await next();
      
      if (isPublic && c.req.method === 'GET') {
        c.header('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
        c.header('Vary', 'Accept, Accept-Encoding');
      } else {
        c.header('Cache-Control', 'no-store, no-cache, must-revalidate');
        c.header('Pragma', 'no-cache');
      }
    };
  }
  ```
- [ ] Применить к публичным endpoints (`/v1/api/content/*`)
- [ ] Применить `no-store` к приватным endpoints (`/v1/api/token/*`, `/v1/api/referral/*`)

#### 6.3. Тесты заголовков кэша

- [ ] Создать тесты:
  ```typescript
  // tests/cache-headers.test.ts
  import { test, expect } from 'vitest';

  test('public endpoints have cache headers', async () => {
    const response = await fetch('https://api.go2asia.space/v1/api/content/countries');
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=300');
  });

  test('private endpoints have no-store', async () => {
    const response = await fetch('https://api.go2asia.space/v1/api/token/balance', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.headers.get('Cache-Control')).toContain('no-store');
  });
  ```
- [ ] Добавить тесты в CI pipeline

#### 6.4. Cloudflare Alerts

**Критические (P0):**
- [ ] Error rate > 1% в течение 5 минут
- [ ] Availability < 99% в течение 10 минут
- [ ] Latency p95 > 1000ms в течение 5 минут

**Предупреждающие (P1):**
- [ ] Error rate > 0.5% в течение 15 минут
- [ ] Latency p95 > 500ms в течение 15 минут
- [ ] Error budget исчерпан на 50%

**Настройка:**
- [ ] Cloudflare Dashboard → Analytics → Alerts
- [ ] Создать правила для каждого алерта
- [ ] Настроить уведомления (email, Slack, PagerDuty)

#### 6.5. Runbooks

- [ ] Создать `/docs/ops/RUNBOOKS.md`
- [ ] Написать runbooks для типичных инцидентов:
  - [ ] Ошибки 5xx в Content Service
  - [ ] Всплеск латентности
  - [ ] Ошибки Clerk Webhook
  - [ ] Проблемы с БД
  - [ ] Превышение rate limit

**Формат runbook:**
```markdown
## Runbook: Ошибки 5xx в Content Service

**Симптомы:**
- Алерт: Error rate > 1%
- Пользователи не могут загрузить контент

**Диагностика:**
1. Проверить логи Cloudflare Workers
2. Проверить статус Neon БД
3. Проверить `/ready` endpoint

**Решение:**
1. Если БД недоступна → проверить Neon dashboard
2. Если код ошибки → проверить логи сервиса
3. Если временный сбой → подождать 5 минут

**Эскалация:**
- Если не решено за 15 минут → связаться с DevOps
```

#### 6.6. SLO/SLI метрики

- [ ] Определить Service Level Objectives:
  | Сервис | Availability | Latency p95 | Error Rate |
  |--------|--------------|-------------|------------|
  | API Gateway | 99.9% | <200ms (GET), <500ms (POST) | <0.1% |
  | Content Service | 99.5% | <300ms | <0.2% |
  | Auth Service | 99.95% | <150ms | <0.05% |
  | Token Service | 99.9% | <200ms | <0.1% |

- [ ] Настроить дашборды в Cloudflare Analytics
- [ ] Настроить отслеживание error budget

### 📝 Результат дня
✅ Кэш-матрица документирована  
✅ Кэширование реализовано в Gateway  
✅ Тесты заголовков проходят  
✅ Алёрты Cloudflare настроены  
✅ Runbooks созданы

---

## 📅 День 7: Фронт и финализация

### 🎯 Цель дня
Реализовать SSR/SSG для публичных страниц, настроить SEO и проверить все exit-критерии.

### ✅ Задачи

#### 7.1. SSR для публичных страниц

**Atlas Asia:**
- [ ] Создать `app/(public)/atlas/countries/[id]/page.tsx`
- [ ] Реализовать `generateStaticParams` для статической генерации
- [ ] Реализовать `generateMetadata` для SEO
- [ ] Реализовать SSR для динамических данных

**Blog Asia:**
- [ ] Создать `app/(public)/blog/page.tsx`
- [ ] Реализовать SSG с `revalidate = 3600`
- [ ] Создать `app/(public)/blog/[slug]/page.tsx` для статей

**Pulse Asia:**
- [ ] Создать `app/(public)/pulse/page.tsx`
- [ ] Реализовать SSR для списка событий

#### 7.2. Мета-теги (OpenGraph, Twitter)

- [ ] Создать компонент `components/og-metadata.tsx`:
  ```typescript
  export function OgMetadata({
    title,
    description,
    image,
    url,
  }: OgMetadataProps) {
    return (
      <>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
      </>
    );
  }
  ```
- [ ] Применить к публичным страницам

#### 7.3. Sitemap и Robots.txt

- [ ] Создать `app/sitemap.ts`:
  ```typescript
  export default async function sitemap() {
    const countries = await fetchCountries();
    const articles = await fetchArticles();
    
    return [
      ...countries.map((country) => ({
        url: `https://go2asia.space/atlas/countries/${country.id}`,
        lastModified: country.updatedAt,
      })),
      ...articles.map((article) => ({
        url: `https://go2asia.space/blog/${article.slug}`,
        lastModified: article.publishedAt,
      })),
    ];
  }
  ```

- [ ] Создать `app/robots.ts`:
  ```typescript
  export default function robots() {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/', '/connect/', '/profile/'],
        },
      ],
      sitemap: 'https://go2asia.space/sitemap.xml',
    };
  }
  ```

#### 7.4. Skeleton UI

- [ ] Создать компоненты скелетонов:
  ```typescript
  // components/skeletons/CountrySkeleton.tsx
  export function CountrySkeleton() {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    );
  }
  ```
- [ ] Применить к страницам загрузки

#### 7.5. Обработка ошибок

- [ ] Создать `app/error.tsx`:
  ```typescript
  'use client';

  export default function Error({
    error,
    reset,
  }: {
    error: Error;
    reset: () => void;
  }) {
    return (
      <div>
        <h2>Что-то пошло не так</h2>
        <button onClick={reset}>Попробовать снова</button>
      </div>
    );
  }
  ```

- [ ] Создать `app/not-found.tsx` для 404 страниц

#### 7.6. Lighthouse проверка

- [ ] Запустить Lighthouse CI:
  ```yaml
  - name: Lighthouse CI
    uses: treosh/lighthouse-ci-action@v10
    with:
      urls: |
        https://go2asia.space
        https://go2asia.space/atlas
        https://go2asia.space/blog
      uploadArtifacts: true
      temporaryPublicStorage: true
  ```
- [ ] Проверить метрики:
  - Performance ≥ 85
  - SEO ≥ 85
  - Best Practices ≥ 85
  - Accessibility ≥ 85

#### 7.7. Финальная проверка exit-критериев

**OpenAPI и генерация:**
- [ ] Все публичные маршруты описаны в OpenAPI
- [ ] Типы генерируются автоматически
- [ ] SDK генерируется автоматически
- [ ] CI проверяет соответствие типов

**CI/CD:**
- [ ] PR pipeline работает
- [ ] Preview deployments настроены
- [ ] Staging окружение работает
- [ ] Production окружение настроено

**Observability:**
- [ ] `/health` у всех сервисов
- [ ] `/ready` у всех сервисов
- [ ] RequestId трассировка работает
- [ ] Алёрты Cloudflare настроены
- [ ] Runbooks созданы

**Кэширование:**
- [ ] Кэш-матрица документирована
- [ ] Публичные GET имеют правильные заголовки
- [ ] Приватные endpoints имеют `no-store`
- [ ] Тесты заголовков проходят

**Безопасность:**
- [ ] Только `jose` для JWT
- [ ] Zod-валидация на Gateway
- [ ] Rate limiting настроен
- [ ] CORS настроен правильно

**Данные:**
- [ ] Миграции работают
- [ ] Seed файлы в UTF-8
- [ ] Бэкапы настроены
- [ ] Rollback протестирован

**Фронт:**
- [ ] SSR для публичных страниц работает
- [ ] SSG для статических страниц работает
- [ ] Sitemap генерируется автоматически
- [ ] Robots.txt настроен
- [ ] Lighthouse ≥ 85 (Perf/SEO/Best)

### 📝 Результат дня
✅ SSR/SSG реализованы  
✅ SEO настроено (мета-теги, sitemap, robots)  
✅ Skeleton UI добавлен  
✅ Обработка ошибок настроена  
✅ Все exit-критерии выполнены

---

## 🎯 Exit-критерии Фазы 0 (финальная проверка)

### ✅ Обязательные критерии

- [ ] **Монорепо:** Структура создана, капсулы изолированы, зависимости настроены
- [ ] **OpenAPI:** Все публичные API описаны, типы/SDK генерируются автоматически
- [ ] **CI/CD:** PR pipeline работает, preview/staging/prod деплои настроены
- [ ] **Observability:** Health/Ready endpoints, логирование, алёрты, runbooks
- [ ] **Безопасность:** JWT через jose, валидация Zod, rate limiting, CORS
- [ ] **Кэширование:** Матрица TTL документирована, заголовки настроены
- [ ] **БД:** Миграции работают, seed файлы UTF-8, бэкапы настроены
- [ ] **Фронт:** SSR/SSG работает, SEO настроено, Lighthouse ≥ 85

### 📊 Метрики готовности

| Категория | Цель | Статус |
|-----------|------|--------|
| Структура проекта | 100% | ⬜ |
| OpenAPI спецификации | 100% | ⬜ |
| CI/CD Pipeline | 100% | ⬜ |
| Observability | 100% | ⬜ |
| Безопасность | 100% | ⬜ |
| Кэширование | 100% | ⬜ |
| База данных | 100% | ⬜ |
| Фронтенд | 100% | ⬜ |

**Общий прогресс:** 0% → Цель: 100%

---

## 🚨 Предотвращение типичных проблем

### Проблема 1: Несовпадение типов фронт/бэк
**Решение:** CI проверяет, что сгенерированные типы совпадают с коммитом

### Проблема 2: JWT библиотеки несовместимы
**Решение:** `pnpm overrides` запрещает другие JWT пакеты, только `jose`

### Проблема 3: Кэш кеширует приватку
**Решение:** Автотест заголовков в CI, `no-store` по умолчанию для приватных

### Проблема 4: Seed файлы не в UTF-8
**Решение:** CI проверяет кодировку всех SQL файлов

### Проблема 5: Незаметные 5xx
**Решение:** Алёрты Cloudflare настроены с первого дня, runbooks готовы

---

## 📚 Следующие шаги после Фазы 0

После завершения Фазы 0 можно переходить к:

1. **Фаза 1:** Разработка сервисов (Auth, Content, Token, Referral)
2. **Интеграция:** Подключение фронтенда к API
3. **Тестирование:** Расширение тестового покрытия
4. **Модули:** Начало разработки пользовательских модулей (Guru, Atlas, Pulse, Blog)

---

**Дата создания:** 2025-11-12  
**Версия:** 1.0  
**Статус:** Готов к реализации

