# Руководство по настройке Neon для Staging и Production

**Дата:** 2025-11-13  
**Статус:** Актуально для настройки Neon баз данных

---

## Обзор

В Neon для staging и production создаются **отдельные проекты**, каждый со своим connection string. Не нужно менять имя пользователя в connection string — нужно использовать connection string из соответствующего проекта.

---

## Как это работает?

### Отдельные проекты = отдельные connection strings

**Неправильно:**
- ❌ Менять имя пользователя в connection string (`staging-neondb_owner`, `prod-neondb_owner`)
- ❌ Использовать один и тот же connection string для обоих окружений

**Правильно:**
- ✅ Создать отдельный Neon проект для staging
- ✅ Создать отдельный Neon проект для production
- ✅ Использовать connection string из соответствующего проекта

---

## Настройка Neon проектов

### Вариант 1: У вас уже есть два проекта (рекомендуется)

Если у вас уже есть отдельные проекты для staging и production:

1. **Staging проект:**
   - Откройте Neon Console → ваш staging проект
   - Connection Details → скопируйте Connection String
   - Это будет `STAGING_DATABASE_URL`

2. **Production проект:**
   - Откройте Neon Console → ваш production проект
   - Connection Details → скопируйте Connection String
   - Это будет `PRODUCTION_DATABASE_URL`

**Пример:**
```
Staging проект:
postgresql://neondb_owner:password@ep-staging-xxx-pooler.c-2.us-east-1.aws.neon.tech/go2asia-staging?sslmode=require

Production проект:
postgresql://neondb_owner:password@ep-production-xxx-pooler.c-2.us-east-1.aws.neon.tech/go2asia-production?sslmode=require
```

Обратите внимание: **разные хосты** (`ep-staging-xxx` vs `ep-production-xxx`) и возможно разные базы данных (`go2asia-staging` vs `go2asia-production`).

### Вариант 2: У вас только один проект

Если у вас только один проект Neon, нужно создать второй:

#### Создание Staging проекта:

1. Откройте [Neon Console](https://console.neon.tech/)
2. Нажмите **Create Project**
3. Название: `go2asia-staging`
4. Region: выберите регион (можно тот же, что и для production)
5. PostgreSQL version: выберите версию (рекомендуется та же, что и в production)
6. Нажмите **Create Project**
7. После создания → Connection Details → скопируйте Connection String

#### Создание Production проекта:

Если у вас уже есть один проект, используйте его как production:

1. Откройте существующий проект
2. Connection Details → скопируйте Connection String
3. Это будет `PRODUCTION_DATABASE_URL`

Или создайте новый проект для production аналогично staging.

---

## Структура Connection String

### Формат Connection String:

```
postgresql://[user]:[password]@[host]/[database]?[parameters]
```

### Что меняется между проектами:

1. **Host (endpoint):** Разный для каждого проекта
   - Staging: `ep-staging-xxx-pooler.c-2.us-east-1.aws.neon.tech`
   - Production: `ep-production-xxx-pooler.c-2.us-east-1.aws.neon.tech`

2. **Database name:** Может быть разным
   - Staging: `go2asia-staging` или `go2asia`
   - Production: `go2asia-production` или `go2asia`

3. **User и Password:** Могут быть одинаковыми или разными (зависит от настроек проекта)

### Что НЕ нужно менять:

- ❌ Не нужно менять имя пользователя (`neondb_owner` → `staging-neondb_owner`)
- ❌ Не нужно менять хост вручную
- ❌ Не нужно добавлять префиксы к параметрам

---

## Примеры правильных Connection Strings

### Staging:

```
postgresql://neondb_owner:password@ep-delicate-fire-ad3chebr-pooler.c-2.us-east-1.aws.neon.tech/go2asia-staging?sslmode=require&channel_binding=require
```

### Production:

```
postgresql://neondb_owner:password@ep-production-xxx-pooler.c-2.us-east-1.aws.neon.tech/go2asia-production?sslmode=require&channel_binding=require
```

**Обратите внимание:**
- Разные хосты (`ep-delicate-fire-ad3chebr` vs `ep-production-xxx`)
- Разные базы данных (`go2asia-staging` vs `go2asia-production`)
- Имя пользователя может быть одинаковым (`neondb_owner`)

---

## Что делать если у вас только один проект?

### Вариант A: Создать второй проект (рекомендуется)

1. Создайте новый проект в Neon Console для staging
2. Используйте существующий проект как production
3. Получите connection strings из обоих проектов

**Преимущества:**
- Полная изоляция staging и production
- Безопасность (staging данные не влияют на production)
- Можно тестировать миграции на staging перед production

### Вариант B: Использовать одну базу (не рекомендуется для production)

Если временно используете одну базу для обоих окружений:

1. Используйте один и тот же connection string для staging и production
2. **⚠️ ВНИМАНИЕ:** Это небезопасно для production!
3. Рекомендуется создать отдельный проект как можно скорее

---

## Настройка в GitHub Secrets

После получения connection strings из Neon:

1. **GitHub Secrets:**
   - `STAGING_DATABASE_URL` = connection string из staging проекта
   - `PRODUCTION_DATABASE_URL` = connection string из production проекта

2. **Cloudflare Workers Secrets:**
   - Для каждого Worker добавить `DATABASE_URL`:
     - Staging Worker/deployment → staging connection string
     - Production Worker/deployment → production connection string

---

## Проверка

### Как проверить что проекты разные:

1. Откройте оба проекта в Neon Console
2. Сравните Connection Details:
   - **Host должен быть разным** (разные endpoints)
   - Database name может быть разным
   - User может быть одинаковым

### Пример различий:

```
Staging проект:
Host: ep-delicate-fire-ad3chebr-pooler.c-2.us-east-1.aws.neon.tech
Database: go2asia-staging

Production проект:
Host: ep-production-xxx-pooler.c-2.us-east-1.aws.neon.tech
Database: go2asia-production
```

---

## Troubleshooting

### Проблема: У меня только один проект

**Решение:** Создайте второй проект в Neon Console. Это займёт несколько минут и бесплатно (на free tier).

### Проблема: Connection strings выглядят одинаково

**Решение:** Убедитесь что вы открыли разные проекты в Neon Console. Каждый проект имеет уникальный endpoint (host).

### Проблема: Не знаю какой проект для staging, какой для production

**Решение:**
- Если проекты уже существуют — проверьте их названия в Neon Console
- Если создаёте новые — назовите их явно: `go2asia-staging` и `go2asia-production`

---

## Best Practices

1. **Всегда используйте отдельные проекты** для staging и production
2. **Не меняйте connection strings вручную** — используйте те, что даёт Neon Console
3. **Храните connection strings в секретах** — никогда не коммитьте их в репозиторий
4. **Проверяйте перед деплоем** — убедитесь что используете правильный connection string для каждого окружения

---

## Ссылки

- [Neon Console](https://console.neon.tech/)
- [Neon Documentation](https://neon.tech/docs/)
- [Creating Projects in Neon](https://neon.tech/docs/manage/projects)

---

**Последнее обновление:** 2025-11-13

