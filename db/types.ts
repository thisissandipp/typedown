import { documentsTable, usersTable } from '@/db/schema';

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertDocument = typeof documentsTable.$inferInsert;
export type SelectDocument = typeof documentsTable.$inferSelect;
