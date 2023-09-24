import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { isValidEmail, sendPasswordResetLink } from '$lib/server/emails';

import type { Actions } from './$types';
import { eq } from 'drizzle-orm';
import { users } from '$lib/database/schema';

export const actions: Actions = {
	default: async ({ request, url }) => {
		console.log('default from src/routes/password-reset/+page.server.ts');

		const formData = await request.formData();
		const email = formData.get('email');

		// basic check
		if (!isValidEmail(email)) {
			return fail(400, {
				message: 'Invalid email'
			});
		}

		try {
			const storedUser = await db.query.users.findFirst({ where: eq(users.email, email as string) });
			if (!storedUser) {
				return fail(400, { message: 'User does not exist' });
			}
			await sendPasswordResetLink(storedUser, url);
			return {
				success: true
			};
		} catch (e) {
			return fail(500, { message: 'An unknown error occurred' });
		}
	}
};
