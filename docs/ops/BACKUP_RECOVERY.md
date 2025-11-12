# Backup & Recovery Guide

## Обзор

Проект использует **Neon PostgreSQL** с Point-in-Time Recovery (PITR) и автоматическими бэкапами.

## Настройка бэкапов в Neon

### 1. Point-in-Time Recovery (PITR)

1. Откройте проект в [Neon Console](https://console.neon.tech/)
2. Перейдите в **Settings** → **Backups**
3. Включите **Point-in-Time Recovery**
4. Настройте **Retention period** (минимум 30 дней)

### 2. Автоматические бэкапы

Neon автоматически создаёт бэкапы:
- **Ежедневно** в указанное время
- **Retention:** минимум 30 дней (настраивается)
- **Хранение:** в Neon Cloud Storage

## Восстановление из бэкапа

### Восстановление из snapshot

1. В Neon Console откройте проект
2. Перейдите в **Backups**
3. Выберите нужный snapshot
4. Нажмите **Restore**
5. Выберите опцию:
   - **Restore to current branch** - восстановить текущую ветку
   - **Create new branch** - создать новую ветку из snapshot

### Branch Restore (рекомендуется для тестирования)

**Использование:**
1. Создайте новую ветку из snapshot
2. Протестируйте восстановление
3. Если всё ок - можно переключиться на эту ветку или удалить её

**Пример:**
```bash
# В Neon Console создайте branch из snapshot
# Затем в connection string используйте branch-specific endpoint
DATABASE_URL=postgresql://user:password@branch-name-host.neon.tech/database
```

### Point-in-Time Recovery

Для восстановления на конкретный момент времени:

1. В Neon Console откройте проект
2. Перейдите в **Backups** → **Point-in-Time Recovery**
3. Выберите момент времени (до 30 дней назад)
4. Создайте новую ветку из этого момента
5. Протестируйте восстановление
6. Если всё ок - переключитесь на эту ветку

## Rollback миграций

### Автоматический rollback в CI/CD

Production deploy workflow автоматически откатывает миграции при неудачных smoke tests:

```bash
# Автоматически выполняется при failure
cd services/content-service
DATABASE_URL=$PRODUCTION_DATABASE_URL pnpm db:migrate:down
```

### Ручной rollback

**Откат последней миграции:**
```bash
cd services/content-service
DATABASE_URL=$PRODUCTION_DATABASE_URL pnpm db:migrate:down
```

**Проверка статуса:**
```bash
pnpm db:migrate:status
```

## Восстановление после инцидента

### Сценарий 1: Ошибочная миграция

1. **Немедленно:** Откатите миграцию
   ```bash
   pnpm db:migrate:down
   ```

2. **Проверьте:** Статус БД
   ```bash
   pnpm db:migrate:status
   ```

3. **Если откат не помог:** Используйте PITR
   - Восстановите из snapshot до миграции
   - Создайте новую ветку
   - Протестируйте
   - Переключитесь на восстановленную ветку

### Сценарий 2: Потеря данных

1. **Определите момент потери данных**
2. **Используйте PITR** для восстановления на момент до потери
3. **Создайте новую ветку** из этого момента
4. **Протестируйте** восстановление
5. **Переключитесь** на восстановленную ветку

### Сценарий 3: Коррупция БД

1. **Создайте snapshot** текущего состояния (для анализа)
2. **Восстановите из последнего рабочего snapshot**
3. **Проверьте логи** для выявления причины
4. **Примените исправления** если необходимо

## Мониторинг бэкапов

### Проверка статуса бэкапов

В Neon Console → **Backups**:
- Последний успешный бэкап
- Статус PITR
- Доступные snapshots

### Алерты

Настройте алерты в Neon Console:
- **Backup failed** - уведомление при неудачном бэкапе
- **Retention warning** - предупреждение при приближении к лимиту retention

## Best Practices

1. **Всегда тестируйте восстановление** на staging перед production
2. **Используйте branch restore** для безопасного тестирования
3. **Документируйте** все восстановления в runbook
4. **Проверяйте статус миграций** после восстановления
5. **Делайте snapshot** перед критическими операциями

## Runbook: Восстановление production БД

### Шаги:

1. **Остановите** production deploy workflow (если запущен)

2. **Определите** момент восстановления:
   - Время последнего рабочего состояния
   - Или конкретный snapshot ID

3. **Создайте branch** из snapshot:
   - Neon Console → Backups → Select snapshot → Create branch

4. **Протестируйте** восстановление:
   ```bash
   # Используйте branch-specific connection string
   DATABASE_URL=postgresql://user:password@branch-name-host.neon.tech/database
   pnpm db:migrate:status
   ```

5. **Если всё ок:**
   - Переключите production на восстановленную ветку
   - Или обновите connection string в secrets

6. **Проверьте** работоспособность:
   - Smoke tests
   - Health checks
   - Критические endpoints

7. **Документируйте** инцидент и восстановление

## Где найти snapshot/branch ID

### В Neon Console:

1. **Backups** → **Snapshots**:
   - Список всех snapshots
   - ID каждого snapshot
   - Время создания

2. **Branches**:
   - Список всех веток
   - Branch-specific connection strings
   - История изменений

### В API:

```bash
# Получить список snapshots через Neon API
curl -H "Authorization: Bearer $NEON_API_KEY" \
  https://console.neon.tech/api/v1/projects/{project_id}/branches/{branch_id}/snapshots
```

## Troubleshooting

### Проблема: Не могу найти нужный snapshot

**Решение:**
- Проверьте retention period (может быть меньше 30 дней)
- Используйте PITR для восстановления на конкретный момент времени

### Проблема: Branch restore не работает

**Решение:**
- Проверьте connection string (должен быть branch-specific)
- Убедитесь что branch создан успешно
- Проверьте права доступа

### Проблема: Миграции не применяются после восстановления

**Решение:**
1. Проверьте статус миграций: `pnpm db:migrate:status`
2. Примените недостающие миграции: `pnpm db:migrate:up`
3. Проверьте что таблица `schema_migrations` существует
