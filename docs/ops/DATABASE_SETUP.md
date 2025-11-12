# Database Setup Guide

## Обзор

Проект использует **Neon PostgreSQL** для хранения данных. Каждый сервис имеет свою собственную схему БД, но может использовать одну и ту же Neon инстанцию (с разными базами данных) или отдельные инстансы.

## Настройка Neon

### 1. Создание проектов

1. Перейдите на [Neon Console](https://console.neon.tech/)
2. Создайте проект для **staging**:
   - Название: `go2asia-staging`
   - Region: выберите ближайший регион
3. Создайте проект для **production**:
   - Название: `go2asia-production`
   - Region: выберите регион для production

### 2. Получение Connection Strings

Для каждого проекта:

1. Откройте проект в Neon Console
2. Перейдите в **Connection Details**
3. Скопируйте **Connection String** (формат: `postgresql://user:password@host/database`)

### 3. Настройка переменных окружения

Добавьте connection strings в GitHub Secrets:

**Staging:**
- `STAGING_DATABASE_URL` - connection string для staging БД

**Production:**
- `PRODUCTION_DATABASE_URL` - connection string для production БД

### 4. Локальная разработка

Создайте `.env` файлы в каждом сервисе:

```bash
# services/content-service/.env
DATABASE_URL=postgresql://user:password@host/database

# services/token-service/.env
DATABASE_URL=postgresql://user:password@host/database

# services/referral-service/.env
DATABASE_URL=postgresql://user:password@host/database
```

**Важно:** Не коммитьте `.env` файлы в репозиторий!

## Миграции

### Генерация миграций

После изменения схемы БД:

```bash
# Content Service
cd services/content-service
pnpm db:migrate:generate

# Token Service
cd services/token-service
pnpm db:migrate:generate

# Referral Service
cd services/referral-service
pnpm db:migrate:generate
```

### Применение миграций

**Локально:**
```bash
cd services/content-service
pnpm db:migrate:up
```

**Staging:**
```bash
DATABASE_URL=$STAGING_DATABASE_URL pnpm db:migrate:up
```

**Production:**
```bash
DATABASE_URL=$PRODUCTION_DATABASE_URL pnpm db:migrate:up
```

### Откат миграций

**Production (только в случае ошибок):**
```bash
DATABASE_URL=$PRODUCTION_DATABASE_URL pnpm db:migrate:down
```

## Seed данные

### Запуск seed файлов

```bash
# Content Service
cd services/content-service
pnpm db:seed
```

**Важно:** Seed файлы должны быть в UTF-8 кодировке!

## Бэкапы

### Настройка Point-in-Time Recovery (PITR)

1. В Neon Console откройте проект
2. Перейдите в **Settings** → **Backups**
3. Включите **Point-in-Time Recovery**
4. Настройте retention period (минимум 30 дней)

### Автоматические бэкапы

Neon автоматически создаёт бэкапы:
- **Ежедневно** в указанное время
- **Retention:** минимум 30 дней (настраивается)

### Восстановление из бэкапа

1. В Neon Console откройте проект
2. Перейдите в **Backups**
3. Выберите нужный бэкап
4. Нажмите **Restore**

## Мониторинг

### Метрики в Neon Console

- **Connection count** - количество активных соединений
- **Query performance** - производительность запросов
- **Storage usage** - использование дискового пространства
- **Backup status** - статус бэкапов

### Логи

Логи доступны в Neon Console → **Logs**:
- Query logs
- Error logs
- Connection logs

## Troubleshooting

### Проблема: Connection timeout

**Решение:**
1. Проверьте connection string
2. Проверьте firewall настройки в Neon
3. Убедитесь что используете правильный регион

### Проблема: Миграция не применяется

**Решение:**
1. Проверьте что миграция сгенерирована правильно
2. Проверьте права доступа к БД
3. Проверьте логи миграции

### Проблема: Seed файлы не работают

**Решение:**
1. Проверьте кодировку файлов (должна быть UTF-8)
2. Проверьте синтаксис SQL
3. Проверьте права доступа

## Best Practices

1. **Всегда тестируйте миграции на staging перед production**
2. **Используйте транзакции для критических операций**
3. **Делайте бэкапы перед применением миграций в production**
4. **Используйте отдельные базы данных для каждого сервиса**
5. **Не храните чувствительные данные в connection strings**

