import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { userProviders } from './user_providers';
import { emailVerificationTokens } from './email_verification_tokens';
import { passwordResetTokens } from './password_reset_tokens';
import { userProfiles } from './user_profiles';

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).default(false).notNull(),
	username: text('username').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: integer('deleted_at', { mode: 'timestamp_ms' })
});

export const usersRelations = relations(users, ({ many, one }) => ({
	profile: one(userProfiles),
	providers: many(userProviders),
	emailVerificationTokens: many(emailVerificationTokens),
	passwordResetTokens: many(passwordResetTokens)
}));

export type User = typeof users.$inferSelect; // return type when queried
export type InsertUser = typeof users.$inferInsert; // insert type
