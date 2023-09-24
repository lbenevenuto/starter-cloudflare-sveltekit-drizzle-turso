// routes/+page.server.ts
import { getAuth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';
import { LuciaError } from 'lucia';

export const load: PageServerLoad = async ({ locals }) => {
	console.log('load from routes/(protected)/profile/+page.server.ts');

	return {
		user: locals.session?.user
	};
};

export const actions: Actions = {
	logout: async ({ locals, platform }) => {
		console.log('logout from routes/(protected)/profile/+page.server.ts');

		const auth = await getAuth(platform);

		if (!locals.session) return fail(401);

		console.log('invalidate');
		await auth.invalidateSession(locals.session.sessionId); // invalidate session
		console.log('setSession');
		locals.AuthRequest.setSession(null); // remove cookie
		console.log('redirect');

		throw redirect(302, '/auth/login'); // redirect to login page
	},

	changePassword: async ({ request, locals }) => {
		console.log('changePassword from routes/(protected)/profile/+page.server.ts');

		const formData = await request.formData();
		const oldPassword = formData.get('oldPassword') as string;
		const newPassword = formData.get('newPassword') as string;

		try {
			let emailKey = await locals.auth.useKey('email', locals.session.user.email, oldPassword);
			if (emailKey) {
				emailKey = await locals.auth.updateKeyPassword('email', locals.session.user.email, newPassword);
				console.log('emailKey :', emailKey);
			}

			let usernameKey = await locals.auth.useKey('username', locals.session.user.username, oldPassword);
			if (usernameKey) {
				usernameKey = await locals.auth.updateKeyPassword('username', locals.session.user.username, newPassword);
				console.log('usernameKey :', usernameKey);
			}

			return { success: true, message: 'Password changed successfully' };
		} catch (e) {
			console.log('ERROR from changePassword :', e);

			if (e instanceof LuciaError) {
				if (e.message === 'AUTH_INVALID_KEY_ID') {
					return fail(422, { success: false, message: 'Invalid key' });
				}

				if (e.message === 'AUTH_INVALID_PASSWORD') {
					return fail(422, { success: false, message: 'Invalid password' });
				}
			}
			// unexpected database error
			return fail(500, { message: 'An unknown error occurred' });
		}
	}
};
