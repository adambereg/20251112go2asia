/**
 * Утилиты для работы с БД
 * Подключение к Neon PostgreSQL через Drizzle
 * Использует @neondatabase/serverless для Cloudflare Workers (HTTP/WebSocket)
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';

// Connection string из переменных окружения
const connectionString = process.env.DATABASE_URL || '';

// Создаём Neon HTTP клиент (работает в Cloudflare Workers)
const sql = neon(connectionString);

// Создаём Drizzle instance с HTTP адаптером
export const db = drizzle(sql, { schema });

/**
 * Проверка подключения к БД
 * Быстрый SELECT 1 + проверка наличия критичных таблиц
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Быстрая проверка подключения
    await sql`SELECT 1`;
    
    // Проверяем доступность таблицы миграций (критичная таблица)
    try {
      await sql`SELECT 1 FROM schema_migrations LIMIT 1`;
    } catch {
      // Таблица может не существовать на первом запуске - это нормально
      // Но если БД уже настроена, таблица должна существовать
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

