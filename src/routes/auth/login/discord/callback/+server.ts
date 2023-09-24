import type { RequestHandler } from './$types';
import { getAuth, getDiscordAuth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { db } from '$lib/server/database';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { type User, users } from '$lib/database/schema';

export const GET: RequestHandler = async ({ url, cookies, locals, platform }) => {
	const storedState = cookies.get('discord_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, { status: 400 });
	}

	try {
		const auth = await getAuth(platform);
		const discordAuth = getDiscordAuth(auth);
		const { getExistingUser, discordUser, createUser, createKey } = await discordAuth.validateCallback(code);
		console.log('discordUser :', discordUser);

		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;

			const existingDatabaseUserWithEmail: User | undefined = await db.query.users.findFirst({ where: eq(users.email, discordUser.email as string) });

			if (existingDatabaseUserWithEmail) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const user = auth.transformDatabaseUser(existingDatabaseUserWithEmail);
				await createKey(user.userId);
				await auth.updateUserAttributes(user.userId, { email_verified: discordUser.verified });
				return user;
			}

			return await createUser({
				attributes: {
					username: discordUser.username,
					email: discordUser.email as string,
					email_verified: discordUser.verified
				}
			});
		};

		const user = await getUser();
		const session = await auth.createSession({ userId: user.userId, attributes: {} });
		locals.AuthRequest.setSession(session);
	} catch (e) {
		// console.log('ERROR DISCORD CALLBACK :', e);
		if (e instanceof OAuthRequestError) {
			console.log('ERROR RESPONSE :', e.response);
			// invalid code
			return new Response('Discord Callback OAuthRequestError', { status: 400 });
		}
		return new Response('An unknown error occurred', { status: 500 });
	}

	throw redirect(307, '/profile');
};
