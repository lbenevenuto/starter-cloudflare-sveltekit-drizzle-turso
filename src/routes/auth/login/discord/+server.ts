import type { RequestHandler } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { getAuth, getDiscordAuth } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies, platform }) => {
	console.log('GET /auth/login/discord/+server.ts');

	const auth = await getAuth(platform);
	const discordAuth = getDiscordAuth(auth);
	const [url, state] = await discordAuth.getAuthorizationUrl();

	// store state
	cookies.set('discord_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 30 * 24 * 60 * 60
	});

	throw redirect(307, url.toString());
};
