import { pgTable, text, timestamp, uuid, varchar, integer, bigint } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Схема БД для Referral Service
 * Реферальные связи и статистика
 */

// Реферальные связи
export const referrals = pgTable('referrals', {
  id: uuid('id').defaultRandom().primaryKey(),
  referrerId: uuid('referrer_id').notNull(), // ID пользователя, который пригласил
  referredId: uuid('referred_id').notNull().unique(), // ID приглашённого пользователя
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, active, completed
  registeredAt: timestamp('registered_at').defaultNow().notNull(),
  activatedAt: timestamp('activated_at'), // Когда реферал стал активным
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Статистика рефералов
export const referralStats = pgTable('referral_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique(), // ID пользователя-реферера
  totalReferrals: integer('total_referrals').default(0).notNull(),
  activeReferrals: integer('active_referrals').default(0).notNull(),
  totalEarned: bigint('total_earned', { mode: 'number' }).default(0).notNull(), // Points заработано от рефералов
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(referralStats, {
    fields: [referrals.referrerId],
    references: [referralStats.userId],
  }),
}));

export const referralStatsRelations = relations(referralStats, ({ many }) => ({
  referrals: many(referrals),
}));

