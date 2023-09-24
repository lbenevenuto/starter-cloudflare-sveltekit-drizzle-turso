import { db } from '$lib/server/database';
import { emailVerificationTokens } from '$lib/database/schema';
import { eq } from 'drizzle-orm';

export async function deleteAllUserEmailVerificationTokens(userId: string) {
	await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.userId, userId));
}
