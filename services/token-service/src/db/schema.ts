import { pgTable, text, timestamp, uuid, varchar, bigint, pgEnum, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Схема БД для Token Service
 * Балансы и транзакции Points
 */

// Тип транзакции
export const transactionTypeEnum = pgEnum('transaction_type', [
  'earn',      // Заработано
  'spend',     // Потрачено
  'transfer',  // Перевод
  'refund',    // Возврат
  'adjustment', // Корректировка
]);

// Статус транзакции
export const transactionStatusEnum = pgEnum('transaction_status', [
  'pending',
  'completed',
  'failed',
  'cancelled',
]);

// Баланс пользователя
export const balances = pgTable('balances', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique(), // ID пользователя из Auth Service
  points: bigint('points', { mode: 'number' }).default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('balances_user_id_idx').on(table.userId),
}));

// Транзакции
export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  idempotencyKey: varchar('idempotency_key', { length: 255 }), // Для идемпотентности
  type: transactionTypeEnum('type').notNull(),
  status: transactionStatusEnum('status').default('completed').notNull(),
  amount: bigint('amount', { mode: 'number' }).notNull(), // Может быть отрицательным
  balanceBefore: bigint('balance_before', { mode: 'number' }).notNull(),
  balanceAfter: bigint('balance_after', { mode: 'number' }).notNull(),
  description: text('description'),
  metadata: text('metadata'), // JSON строка с дополнительными данными
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('transactions_user_id_idx').on(table.userId),
  createdAtIdx: index('transactions_created_at_idx').on(table.createdAt),
  // Уникальный индекс для идемпотентности
  idempotencyIdx: uniqueIndex('transactions_idempotency_idx').on(table.userId, table.idempotencyKey),
  // Композитный индекс для cursor-based пагинации
  cursorIdx: index('transactions_cursor_idx').on(table.createdAt, table.id),
}));

// Relations
export const balancesRelations = relations(balances, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  balance: one(balances, {
    fields: [transactions.userId],
    references: [balances.userId],
  }),
}));

