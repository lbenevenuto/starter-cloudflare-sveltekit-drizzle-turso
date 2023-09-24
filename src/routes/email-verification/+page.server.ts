import { fail } from '@sveltejs/kit';
import { sendEmailVerificationLink } from '$lib/server/emails';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals, url }) => {
		try {
			await sendEmailVerificationLink(locals.session.user, url);
			return {
				success: true
			};
		} catch {
			return fail(500, { message: 'An unknown error occurred' });
		}
	}
};
