import { pgTable, text, timestamp, uuid, varchar, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Схема БД для Content Service
 * Страны, города, места, события, статьи
 */

// Страны
export const countries = pgTable('countries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  code: varchar('code', { length: 2 }).notNull().unique(), // ISO 3166-1 alpha-2
  description: text('description'),
  metadata: jsonb('metadata'), // Дополнительные данные (флаги, координаты и т.д.)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Города
export const cities = pgTable('cities', {
  id: uuid('id').defaultRandom().primaryKey(),
  countryId: uuid('country_id').references(() => countries.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  metadata: jsonb('metadata'), // Координаты, население и т.д.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Места (достопримечательности, рестораны, отели и т.д.)
export const places = pgTable('places', {
  id: uuid('id').defaultRandom().primaryKey(),
  cityId: uuid('city_id').references(() => cities.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // attraction, restaurant, hotel, etc.
  description: text('description'),
  address: text('address'),
  coordinates: jsonb('coordinates'), // { lat, lng }
  metadata: jsonb('metadata'), // Часы работы, контакты, фото и т.д.
  isRussianFriendly: boolean('is_russian_friendly').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// События
export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  cityId: uuid('city_id').references(() => cities.id).notNull(),
  placeId: uuid('place_id').references(() => places.id), // Опционально
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  metadata: jsonb('metadata'), // Цена, контакты, фото и т.д.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Статьи/блог посты
export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: uuid('author_id').notNull(), // ID пользователя из Auth Service
  cityId: uuid('city_id').references(() => cities.id),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  publishedAt: timestamp('published_at'),
  metadata: jsonb('metadata'), // Теги, категории, фото и т.д.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const countriesRelations = relations(countries, ({ many }) => ({
  cities: many(cities),
}));

export const citiesRelations = relations(cities, ({ one, many }) => ({
  country: one(countries, {
    fields: [cities.countryId],
    references: [countries.id],
  }),
  places: many(places),
  events: many(events),
  articles: many(articles),
}));

export const placesRelations = relations(places, ({ one, many }) => ({
  city: one(cities, {
    fields: [places.cityId],
    references: [cities.id],
  }),
  events: many(events),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  city: one(cities, {
    fields: [events.cityId],
    references: [cities.id],
  }),
  place: one(places, {
    fields: [events.placeId],
    references: [places.id],
  }),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  city: one(cities, {
    fields: [articles.cityId],
    references: [cities.id],
  }),
}));

