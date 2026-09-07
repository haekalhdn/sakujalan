import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const accounts = sqliteTable('runway_accounts', { owner: text('owner').primaryKey(), version: integer('version').notNull().default(0), state: text('state').notNull(), updatedAt: text('updated_at').notNull() });
