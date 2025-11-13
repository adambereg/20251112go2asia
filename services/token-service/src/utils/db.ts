/**
 * Утилиты для работы с БД
 * Подключение к Neon PostgreSQL через Drizzle
 * Использует @neondatabase/serverless для Cloudflare Workers (HTTP/WebSocket)
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';

// Функция для получения connection string из переменных окружения
// В Cloudflare Workers env доступен через c.env
function getConnectionString(env?: { DATABASE_URL?: string }): string {
  return env?.DATABASE_URL || '';
}

// Создаём функцию для получения db instance
export function getDb(env?: { DATABASE_URL?: string }) {
  const connectionString = getConnectionString(env);
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  // Создаём Neon HTTP клиент (работает в Cloudflare Workers)
  const sql = neon(connectionString);
  // Создаём Drizzle instance с HTTP адаптером
  // Используем as any для обхода проблемы совместимости типов между drizzle и neon
  return drizzle(sql as any, { schema });
}

// Для обратной совместимости создаём db с пустой строкой (будет ошибка при использовании без env)
// В реальном использовании нужно передавать env из контекста запроса
const connectionString = '';
const sql = connectionString ? neon(connectionString) : null;
export const db = sql ? drizzle(sql as any, { schema }) : null as any;

/**
 * Проверка подключения к БД
 * Быстрый SELECT 1 + проверка наличия критичных таблиц
 */
export async function checkDatabaseConnection(env?: { DATABASE_URL?: string }): Promise<boolean> {
  try {
    const connectionString = getConnectionString(env);
    if (!connectionString) {
      return false;
    }
    const sqlInstance = neon(connectionString);
    
    // Быстрая проверка подключения
    await sqlInstance`SELECT 1`;
    
    // Проверяем доступность таблицы миграций (критичная таблица)
    try {
      await sqlInstance`SELECT 1 FROM schema_migrations LIMIT 1`;
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

