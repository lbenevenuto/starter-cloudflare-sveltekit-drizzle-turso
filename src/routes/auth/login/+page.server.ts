// routes/login/+page.server.ts
import { getAuth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals, platform }) => {
		const formData = await request.formData();
		const username_email = formData.get('username_email');
		const password = formData.get('password');
		// basic check
		if (typeof username_email !== 'string' || username_email.length < 1 || username_email.length > 31) {
			return fail(400, { message: 'Invalid username' });
		}
		if (typeof password !== 'string' || password.length < 1 || password.length > 255) {
			return fail(400, { message: 'Invalid password' });
		}

		try {
			const auth = await getAuth(platform);
			// find user by key
			// and validate password
			const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			const providerId = validEmailRegex.test(username_email) ? 'email' : 'username';
			const key = await auth.useKey(providerId, username_email.toLowerCase(), password);

			const session = await auth.createSession({ userId: key.userId, attributes: {} });
			locals.AuthRequest.setSession(session); // set session cookie
		} catch (e) {
			if (e instanceof LuciaError && (e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')) {
				// user does not exist
				// or invalid password
				return fail(400, { message: 'Incorrect username or password' });
			}
			return fail(500, { message: 'An unknown error occurred' });
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/profile');
	}
};
