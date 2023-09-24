import { validateEmailVerificationToken } from '$lib/server/tokens';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	console.log('email-verification/[token]/+server.ts GET');

	const { token } = params;
	try {
		const userId = await validateEmailVerificationToken(token);
		const user = await locals.auth.getUser(userId);
		await locals.auth.invalidateAllUserSessions(user.userId);
		await locals.auth.updateUserAttributes(user.userId, { email_verified: true });
		const session = await locals.auth.createSession({ userId: user.userId, attributes: {} });
		locals.AuthRequest.setSession(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/profile'
			}
		});
	} catch {
		return new Response('Invalid email verification link', { status: 400 });
	}
};
