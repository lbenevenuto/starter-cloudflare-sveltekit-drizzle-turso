import { fail, redirect } from '@sveltejs/kit';
import { isValidPasswordResetToken, validatePasswordResetToken } from '$lib/server/tokens';

import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	console.log('load from src/routes/password-reset/[token]/+page.server.ts');

	const { token } = params;
	const validToken = await isValidPasswordResetToken(token);
	if (!validToken) {
		throw redirect(302, '/password-reset');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		console.log('default from src/routes/password-reset/[token]/+page.server.ts');

		const formData = await request.formData();
		const password = formData.get('password');

		// basic check
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, { message: 'Invalid password' });
		}

		try {
			const { token } = params;
			const userId = await validatePasswordResetToken(token);
			let user = await locals.auth.getUser(userId);

			await locals.auth.invalidateAllUserSessions(user.userId);
			await locals.auth.updateKeyPassword('email', user.email, password);
			await locals.auth.updateKeyPassword('username', user.username, password);

			if (!user.emailVerified) {
				user = await locals.auth.updateUserAttributes(user.userId, { email_verified: true });
			}

			const session = await locals.auth.createSession({ userId: user.userId, attributes: {} });
			locals.AuthRequest.setSession(session);
		} catch (e) {
			console.log('ERROR from default src/routes/password-reset/[token]/+page.server.ts :', e);

			return fail(400, { message: 'Invalid or expired password reset link' });
		}
		throw redirect(302, '/profile');
	}
};
