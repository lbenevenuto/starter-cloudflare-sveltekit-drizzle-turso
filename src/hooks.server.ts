import { getAuth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { deleteAllUserEmailVerificationTokens } from '$lib/server/database/models/user';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('Handle from src/hooks.server.ts');
	console.log('event.route.id :', event.route.id);
	console.log('*********************************************');

	event.locals.auth = await getAuth(event.platform);
	event.locals.AuthRequest = event.locals.auth.handleRequest(event);
	const session = await event.locals.AuthRequest.validate();
	if (session) {
		if (event.route.id == '/auth/register' || event.route.id == '/auth/login') {
			throw redirect(302, '/');
		} else if (event.route.id == '/email-verification/[token]' && session.user.emailVerified) {
			await deleteAllUserEmailVerificationTokens(session.user.userId);
			throw redirect(302, '/profile');
		} else if (event.route.id == '/email-verification' && session.user.emailVerified) {
			throw redirect(302, '/profile');
		}

		event.locals.session = session;
	} else {
		if (event.route.id?.startsWith('/(protected') || event.route.id == '/email-verification') throw redirect(302, '/auth/login');
	}

	return await resolve(event);
};
