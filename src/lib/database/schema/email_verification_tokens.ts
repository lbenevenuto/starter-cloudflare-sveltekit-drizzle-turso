import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const emailVerificationTokens = sqliteTable('email_verification_tokens', {
	id: text('id').primaryKey(),
	expires: integer('expires'),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: integer('deleted_at', { mode: 'timestamp_ms' })
});

export const emailVerificationTokensRelations = relations(emailVerificationTokens, ({ one }) => ({
	user: one(users, { fields: [emailVerificationTokens.userId], references: [users.id] })
}));
