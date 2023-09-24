import type { RequestHandler } from './$types';
import { getAuth, getGoogleAuth } from '$lib/server/lucia';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { db } from '$lib/server/database';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { type User, users } from '$lib/database/schema';

export const GET: RequestHandler = async ({ url, cookies, locals, platform }) => {
	const storedState = cookies.get('google_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, { status: 400 });
	}

	try {
		const auth = await getAuth(platform);
		const googleAuth = getGoogleAuth(auth);
		const { getExistingUser, googleUser, createUser, createKey } = await googleAuth.validateCallback(code);
		console.log('googleUser :', googleUser);

		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;

			const existingDatabaseUserWithEmail: User | undefined = await db.query.users.findFirst({ where: eq(users.email, googleUser.email as string) });

			if (existingDatabaseUserWithEmail) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const user = auth.transformDatabaseUser(existingDatabaseUserWithEmail);
				await createKey(user.userId);
				await auth.updateUserAttributes(user.userId, { email_verified: googleUser.email_verified });
				return user;
			}

			return await createUser({
				attributes: {
					username: googleUser.name,
					email: googleUser.email as string,
					email_verified: googleUser.email_verified,
					avatar: googleUser.picture
				}
			});
		};

		const user = await getUser();
		const session = await auth.createSession({ userId: user.userId, attributes: {} });
		locals.AuthRequest.setSession(session);
	} catch (e) {
		console.log('ERROR GOOGLE CALLBACK :', e);
		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response('Google Callback OAuthRequestError', { status: 400 });
		}
		return new Response('An unknown error occurred', { status: 500 });
	}

	throw redirect(307, '/profile');
};
