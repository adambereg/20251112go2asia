/**
 * Скрипт для проверки статуса миграций
 */

import { neon } from '@neondatabase/serverless';
import { readdir } from 'fs/promises';
import { join } from 'path';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function status() {
  const migrationsDir = join(process.cwd(), 'migrations');
  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const applied = await sql`
    SELECT version, applied_at FROM schema_migrations
    ORDER BY applied_at
  `;

  const appliedVersions = new Set(applied.map((m) => m.version));

  console.log('\nMigration Status:');
  console.log('==================\n');

  for (const file of files) {
    const version = file.replace('.sql', '');
    const isApplied = appliedVersions.has(version);
    const status = isApplied ? '✓ Applied' : '✗ Pending';
    const appliedAt = applied.find((m) => m.version === version)?.applied_at;

    console.log(`${status} ${version}${appliedAt ? ` (${appliedAt})` : ''}`);
  }

  console.log(`\nTotal: ${applied.length}/${files.length} migrations applied\n`);
}

status().catch((error) => {
  console.error('Status check failed:', error);
  process.exit(1);
});

