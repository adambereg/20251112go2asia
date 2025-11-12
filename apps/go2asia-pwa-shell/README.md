# Go2Asia PWA Shell

Основной PWA shell для экосистемы Go2Asia. Управляет маршрутизацией и загрузкой модулей.

## Технологии

- **Next.js 15** — React фреймворк с App Router
- **TypeScript** — типизация
- **Tailwind CSS** — стилизация (будет добавлено)

## Разработка

```bash
# Локальная разработка
pnpm dev

# Сборка
pnpm build

# Запуск production
pnpm start
```

## Структура

- `app/` — Next.js App Router
  - `(public)/` — публичные страницы (SSR/SSG)
  - `(private)/` — приватные страницы (SPA)
- `components/` — React компоненты
- `lib/` — утилиты и хелперы

