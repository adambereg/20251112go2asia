# API Gateway

Единая точка входа для всех API запросов в экосистеме Go2Asia.

## Технологии

- **Cloudflare Workers** — serverless платформа
- **Hono** — быстрый веб-фреймворк для Workers

## Разработка

```bash
# Локальная разработка
pnpm dev

# Деплой
pnpm deploy
```

## Структура

- `src/index.ts` — точка входа
- `src/routes/` — маршруты API
- `src/middleware/` — middleware (auth, validation, logging)
- `src/utils/` — утилиты (proxy, error handling)

