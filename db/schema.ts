import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey(),
  displayName: text('display_name').notNull().default('User'),
  email: text('email').notNull().unique(),
  emailConfirmed: boolean('email_confirmed').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  documents: many(documentsTable),
}));

export const documentsTable = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content'),
  isArchived: boolean('is_archived').default(false),
  isFavorite: boolean('is_favorite').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const documentsRelations = relations(documentsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [documentsTable.userId],
    references: [usersTable.id],
  }),
}));
