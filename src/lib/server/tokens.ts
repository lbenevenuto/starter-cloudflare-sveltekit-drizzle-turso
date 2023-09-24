import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import type { User } from '$lib/database/schema';
import { db } from '$lib/server/database';
import { eq } from 'drizzle-orm';
import { emailVerificationTokens, passwordResetTokens } from '$lib/database/schema';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
	console.log('generateEmailVerificationToken');

	const storedUserTokens = await db.query.emailVerificationTokens.findMany({ where: eq(emailVerificationTokens.userId, userId) });
	console.log('storedUserTokens :', storedUserTokens);
	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const token = generateRandomString(63);
	console.log('token :', token);
	await db.insert(emailVerificationTokens).values({
		id: token,
		userId,
		expires: Date.now() + EXPIRES_IN
	});

	return token;
};

export const validateEmailVerificationToken = async (token: string) => {
	console.log('validateEmailVerificationToken');

	const storedToken = await db.transaction(async (trx) => {
		const storedToken = await trx.query.emailVerificationTokens.findFirst({ where: eq(emailVerificationTokens.id, token) });
		if (!storedToken) throw new Error('Invalid token');
		await trx.delete(emailVerificationTokens).where(eq(emailVerificationTokens.userId, storedToken.userId));
		return storedToken;
	});
	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}
	return storedToken.userId;
};

export const generatePasswordResetToken = async (user: User) => {
	console.log('generatePasswordResetToken');

	const storedUserTokens = await db.query.passwordResetTokens.findMany({ where: eq(passwordResetTokens.userId, user.id) });

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const token = generateRandomString(63);
	await db.insert(passwordResetTokens).values({
		id: token,
		userId: user.id,
		expires: Date.now() + EXPIRES_IN
	});

	return token;
};

export const validatePasswordResetToken = async (token: string) => {
	console.log('validatePasswordResetToken');

	const storedToken = await db.transaction(async (trx) => {
		const storedToken = await trx.query.passwordResetTokens.findFirst({ where: eq(passwordResetTokens.id, token) });
		if (!storedToken) throw new Error('Invalid token');
		await trx.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, storedToken.userId));
		return storedToken;
	});
	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}
	return storedToken.userId;
};

export const isValidPasswordResetToken = async (token: string) => {
	console.log('isValidPasswordResetToken');

	const storedToken = await db.query.passwordResetTokens.findFirst({ where: eq(passwordResetTokens.id, token) });
	if (!storedToken) return false;
	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	return isWithinExpiration(tokenExpires);
};
