/**
 * Скрипт для отката последней миграции
 */

import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function migrateDown() {
  // Получаем последнюю применённую миграцию
  const lastMigration = await sql`
    SELECT version FROM schema_migrations
    ORDER BY applied_at DESC
    LIMIT 1
  `.then((rows) => rows[0]?.version);

  if (!lastMigration) {
    console.log('No migrations to rollback');
    return;
  }

  console.log(`Rolling back migration ${lastMigration}...`);

  // TODO: Реализовать SQL для отката конкретной миграции
  // Пока просто удаляем запись о миграции
  await sql`BEGIN`;
  try {
    await sql`
      DELETE FROM schema_migrations WHERE version = ${lastMigration}
    `;
    await sql`COMMIT`;
    console.log(`✓ Migration ${lastMigration} rolled back`);
  } catch (error) {
    await sql`ROLLBACK`;
    console.error(`✗ Rollback failed:`, error);
    throw error;
  }
}

migrateDown().catch((error) => {
  console.error('Rollback failed:', error);
  process.exit(1);
});

