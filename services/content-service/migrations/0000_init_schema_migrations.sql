-- Таблица для отслеживания применённых миграций
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS schema_migrations_applied_at_idx ON schema_migrations(applied_at);

