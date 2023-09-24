import { getAuth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { LibsqlError } from '@libsql/client/web';
import { sendEmailVerificationLink } from '$lib/server/emails';

export const actions: Actions = {
	default: async ({ request, locals, platform, url }) => {
		console.log('Register');

		const formData = await request.formData();
		const username = formData.get('username') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		// basic check
		if (username.length < 4 || username.length > 31) {
			return fail(400, { message: 'Invalid username' });
		}
		if (password.length < 6 || password.length > 255) {
			return fail(400, { message: 'Invalid password' });
		}

		try {
			console.log('Register try');
			const auth = await getAuth(platform);
			const user = await auth.createUser({
				key: {
					providerId: 'email', // auth method
					providerUserId: email?.toLowerCase(),
					password
				},
				attributes: {
					username,
					email,
					email_verified: false
				}
			});
			console.log('user created :', user);

			const key = await auth.createKey({
				userId: user.userId,
				providerId: 'username',
				providerUserId: username.toLowerCase(),
				password
			});
			console.log('key created :', key);
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			await sendEmailVerificationLink(user, url);
			locals.AuthRequest.setSession(session); // set session cookie
		} catch (e) {
			console.log('Register catch');
			console.log(e);
			// this part depends on the database you're using
			// check for unique constraint error in user table
			if (e instanceof LibsqlError) return fail(400, { message: e.message });
			return fail(500, { message: 'An unknown error occurred' });
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/profile');
	}
};
