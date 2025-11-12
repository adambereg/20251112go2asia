/**
 * Скрипт для применения миграций
 * Поддерживает атомарность через транзакции
 */

import { neon } from '@neondatabase/serverless';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { readFileSync } from 'fs';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function migrate() {
  const migrationsDir = join(process.cwd(), 'migrations');
  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith('.sql'))
    .sort(); // Применяем по алфавиту

  console.log(`Found ${files.length} migration files`);

  for (const file of files) {
    const version = file.replace('.sql', '');
    
    // Проверяем, применена ли уже миграция
    const applied = await sql`
      SELECT 1 FROM schema_migrations WHERE version = ${version}
    `.then((rows) => rows.length > 0);

    if (applied) {
      console.log(`✓ Migration ${version} already applied, skipping`);
      continue;
    }

    console.log(`Applying migration ${version}...`);

    const migrationSQL = readFileSync(join(migrationsDir, file), 'utf-8');

    // Оборачиваем в транзакцию
    await sql`BEGIN`;
    try {
      // Применяем миграцию
      await sql.unsafe(migrationSQL);
      
      // Записываем версию
      await sql`
        INSERT INTO schema_migrations (version, applied_at)
        VALUES (${version}, NOW())
      `;
      
      await sql`COMMIT`;
      console.log(`✓ Migration ${version} applied successfully`);
    } catch (error) {
      await sql`ROLLBACK`;
      console.error(`✗ Migration ${version} failed:`, error);
      throw error;
    }
  }

  console.log('All migrations applied');
}

migrate().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});

