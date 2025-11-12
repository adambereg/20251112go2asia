# Neon: Backup и Recovery Playbook

**Версия:** 1.0  
**Дата:** 2025-11-09

---

## Настройка Point-in-Time Recovery (PITR)

### 1. Включить PITR в Neon

1. Открыть **Neon Dashboard** → Project → Settings
2. Включить **Point-in-Time Recovery**
3. Выбрать период хранения (рекомендуется 7 дней для staging, 30 дней для production)

### 2. Проверка PITR

```sql
-- Проверить, что PITR включен
SELECT 
  name,
  setting,
  unit
FROM pg_settings
WHERE name LIKE '%recovery%';
```

---

## Процесс восстановления

### Сценарий 1: Восстановление на определённую точку времени

**Когда использовать:** Потеря данных, коррупция данных, ошибочное удаление

**Шаги:**

1. **Определить точку восстановления**
   ```bash
   # В Neon Dashboard → Backups
   # Выбрать нужную точку времени (timestamp)
   ```

2. **Создать новый branch для восстановления**
   ```bash
   # Через Neon Dashboard:
   # Backups → Select restore point → Create branch
   # Или через API:
   curl -X POST "https://console.neon.tech/api/v1/projects/{project_id}/branches" \
     -H "Authorization: Bearer {api_key}" \
     -H "Content-Type: application/json" \
     -d '{
       "branch": {
         "name": "recovery-2025-11-09",
         "parent_id": "{parent_branch_id}",
         "point_in_time": "2025-11-09T10:00:00Z"
       }
     }'
   ```

3. **Проверить данные на recovery branch**
   ```bash
   # Получить connection string для recovery branch
   # Подключиться и проверить данные
   psql "postgresql://user:password@recovery-branch.neon.tech/dbname"
   ```

4. **Валидация данных**
   ```sql
   -- Проверить количество записей
   SELECT COUNT(*) FROM countries;
   SELECT COUNT(*) FROM cities;
   SELECT COUNT(*) FROM places;
   
   -- Проверить целостность данных
   SELECT * FROM countries WHERE id NOT IN (SELECT DISTINCT country_id FROM cities);
   ```

5. **Промоут recovery branch в production**
   ```bash
   # В Neon Dashboard:
   # Branches → recovery-2025-11-09 → Promote to primary
   # Или через API:
   curl -X POST "https://console.neon.tech/api/v1/projects/{project_id}/branches/{recovery_branch_id}/set_as_primary" \
     -H "Authorization: Bearer {api_key}"
   ```

6. **Обновить DATABASE_URL в Cloudflare**
   ```bash
   # Обновить Secret в Cloudflare
   wrangler secret put DATABASE_URL --env production
   # Ввести новый connection string
   ```

7. **Проверить работу приложения**
   ```bash
   # Smoke тесты
   curl https://api.go2asia.space/health
   curl https://api.go2asia.space/ready
   ```

---

### Сценарий 2: Выборочное восстановление таблицы

**Когда использовать:** Коррупция данных в одной таблице

**Шаги:**

1. **Создать recovery branch** (как в Сценарии 1, шаг 2)

2. **Экспортировать данные из recovery branch**
   ```bash
   # Подключиться к recovery branch
   psql "postgresql://user:password@recovery-branch.neon.tech/dbname" \
     -c "COPY (SELECT * FROM countries) TO STDOUT CSV HEADER" > countries_backup.csv
   ```

3. **Очистить таблицу в production**
   ```sql
   -- В production branch
   TRUNCATE TABLE countries CASCADE;
   ```

4. **Импортировать данные в production**
   ```bash
   psql "postgresql://user:password@production.neon.tech/dbname" \
     -c "COPY countries FROM STDIN CSV HEADER" < countries_backup.csv
   ```

5. **Проверить целостность**
   ```sql
   -- Проверить foreign keys
   SELECT * FROM cities WHERE country_id NOT IN (SELECT id FROM countries);
   ```

---

### Сценарий 3: Восстановление после миграции

**Когда использовать:** Миграция сломала production

**Шаги:**

1. **Откатить миграцию**
   ```bash
   cd services/content-service
   pnpm db:migrate:down
   ```

2. **Если откат не помог — восстановить из бэкапа**
   - Следовать Сценарию 1
   - Выбрать точку времени до миграции

---

## Тестирование восстановления (ежемесячно)

### Процесс

1. **Создать тестовый branch**
   ```bash
   # В Neon Dashboard создать branch от production
   # Название: test-recovery-YYYY-MM-DD
   ```

2. **Восстановить на точку времени неделю назад**
   ```bash
   # Выбрать точку времени 7 дней назад
   # Создать recovery branch
   ```

3. **Проверить данные**
   ```sql
   -- Проверить количество записей
   -- Проверить целостность
   -- Проверить критичные данные
   ```

4. **Удалить тестовый branch**
   ```bash
   # После проверки удалить test-recovery branch
   ```

---

## Автоматические бэкапы

### Настройка в Neon

Neon автоматически создаёт бэкапы:
- **Production:** Каждые 24 часа
- **Staging:** Каждые 24 часа
- **Хранение:** 7 дней (staging), 30 дней (production)

### Экспорт бэкапов в S3 (опционально)

Для долгосрочного хранения можно экспортировать бэкапы в S3:

```bash
# Использовать pg_dump для экспорта
pg_dump "postgresql://user:password@host/dbname" \
  | gzip \
  | aws s3 cp - s3://go2asia-backups/db-backup-$(date +%Y%m%d).sql.gz
```

---

## Мониторинг бэкапов

### Проверка статуса бэкапов

```bash
# Через Neon API
curl -X GET "https://console.neon.tech/api/v1/projects/{project_id}/backups" \
  -H "Authorization: Bearer {api_key}"
```

### Алерты

Настроить алерты на:
- Отсутствие бэкапа за последние 24 часа
- Ошибки восстановления
- Недостаточное место для бэкапов

---

## RTO и RPO

**Recovery Time Objective (RTO):** <4 часов  
**Recovery Point Objective (RPO):** <24 часов

---

## Чек-лист восстановления

- [ ] Определена точка восстановления
- [ ] Создан recovery branch
- [ ] Проверены данные на recovery branch
- [ ] Валидация данных пройдена
- [ ] Recovery branch промоутнут в production
- [ ] DATABASE_URL обновлён в Cloudflare
- [ ] Smoke тесты пройдены
- [ ] Мониторинг проверен
- [ ] Команда уведомлена

---

**Последнее обновление:** 2025-11-09

