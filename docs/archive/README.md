# Архив документации

**Дата создания:** 2025-11-13  
**Причина:** Документация, созданная после коммита `39278f0` (до внедрения staging/production деплоев)

---

## Описание

Эта директория содержит документацию, которая была создана в процессе разработки staging и production деплоев, но больше не актуальна после отката к состоянию без автоматических деплоев.

---

## Содержимое

### CI/CD и деплои
- `CI_CD_SETUP.md` - Настройка CI/CD
- `WORKFLOWS_EXPLAINED.md` - Объяснение GitHub Actions workflows
- `PHASE0_COMPLETION.md` - План завершения Фазы 0
- `PRODUCTION_DEPLOY_ISSUE.md` - Проблема с автоматическим production деплоем
- `STAGING_VS_PRODUCTION.md` - Сравнение staging и production подходов

### Миграция инфраструктуры
- `MIGRATION_GUIDE.md` - Руководство по миграции инфраструктуры
- `MIGRATION_CHECKLIST.md` - Чеклист миграции
- `ENVIRONMENTS_EXPLAINED.md` - Объяснение GitHub Environments

### Секреты и конфигурация
- `SECRETS_EXPLAINED.md` - Объяснение секретов
- `CLOUDFLARE_SECRETS_GUIDE.md` - Руководство по секретам Cloudflare Workers
- `NEON_SETUP_GUIDE.md` - Руководство по настройке Neon
- `CREATE_STAGING_WORKER.md` - Инструкция по созданию staging Worker

### Операционные документы
- `ALERTS.md` - Настройка Cloudflare Alerts
- `SLO_SLI.md` - Service Level Objectives и Indicators
- `GO_NO_GO.md` - Go/No-Go чеклист
- `EXIT_CRITERIA.md` - Exit критерии для Фазы 0
- `CACHE_MATRIX.md` - Матрица кэширования
- `DATABASE_SETUP.md` - Настройка базы данных

---

## Когда использовать

Эти документы могут быть полезны, если:
- Планируется вернуть staging/production деплои
- Нужна информация о настройке инфраструктуры
- Требуется понимание процессов миграции

---

**Примечание:** Документация сохранена для справки, но не актуальна для текущего состояния проекта (без автоматических деплоев).

