/**
 * Утилиты для работы с БД
 * Подключение к Neon PostgreSQL через Drizzle
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';

// Connection string из переменных окружения
const connectionString = process.env.DATABASE_URL || '';

// Создаём клиент postgres
const client = postgres(connectionString, {
  max: 1, // Для Cloudflare Workers используем только 1 соединение
});

// Создаём Drizzle instance
export const db = drizzle(client, { schema });

/**
 * Проверка подключения к БД
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

