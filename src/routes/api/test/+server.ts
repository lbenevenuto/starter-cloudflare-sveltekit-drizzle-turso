import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database';

export const GET: RequestHandler = async ({ url }) => {
	console.log('url :', typeof url);
	const ret: NonNullable<unknown> = {};

	const results = await db.query.users.findMany({
		with: {
			profile: true,
			providers: true,
			emailVerificationTokens: true,
			passwordResetTokens: true
		}
	});
	console.log('results :', results);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	ret.users = results;

	return json(ret);
};
