/**
 * Seed скрипт для Token Service
 */

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

const seedFiles = [
  'balances.sql',
  'transactions.sql',
];

async function seed() {
  console.log('Starting seed process...');

  for (const file of seedFiles) {
    const filePath = join(process.cwd(), 'seeds', file);
    const sqlContent = readFileSync(filePath, 'utf-8');

    console.log(`Seeding ${file}...`);

    try {
      await sql.unsafe(sqlContent);
      console.log(`✓ ${file} seeded successfully`);
    } catch (error) {
      console.error(`✗ ${file} seeding failed:`, error);
      throw error;
    }
  }

  console.log('All seeds completed');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});

