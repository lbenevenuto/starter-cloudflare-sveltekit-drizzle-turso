import { lucia } from 'lucia';
import { libsql } from '@lucia-auth/adapter-sqlite';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { client } from '$lib/server/database';
import { unstorage } from '@lucia-auth/adapter-session-unstorage';
import { createStorage } from 'unstorage';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, ENVIRONMENT } from '$env/static/private';
import { discord, google } from '@lucia-auth/oauth/providers';

const createRedisStorage = async () => {
	console.log('Creating Redis Storage');
	const { REDIS_URL } = await import('$env/static/private');
	const redisDriver = (await import('unstorage/drivers/redis')).default;
	return createStorage({
		driver: redisDriver({ url: REDIS_URL })
	});
};

const createCloudflareKVStorage = async (platform: App.Platform | undefined) => {
	console.log('Creating Cloudflare KV Storage');
	const cloudflareKVBindingDriver = (await import('unstorage/drivers/cloudflare-kv-binding')).default;
	return createStorage({
		driver: cloudflareKVBindingDriver({ binding: platform?.env.KV_SESSIONS })
	});
};

export async function getAuth(platform: App.Platform | undefined) {
	let storage;
	if (ENVIRONMENT == 'development') {
		storage = await createRedisStorage();
	} else {
		storage = await createCloudflareKVStorage(platform);
	}

	return lucia({
		env: dev ? 'DEV' : 'PROD',
		middleware: sveltekit(),
		adapter: {
			user: libsql(client, {
				user: 'users',
				key: 'user_providers',
				session: null
			}),
			session: unstorage(storage)
		},
		sessionCookie: {
			expires: false
		},
		getUserAttributes: (databaseUser) => {
			return {
				username: databaseUser.username,
				email: databaseUser.email,
				emailVerified: Boolean(databaseUser.email_verified)
			};
		}
	});
}

export const getGoogleAuth = (auth: Lucia.Auth) => {
	return google(auth, {
		clientId: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		redirectUri: GOOGLE_REDIRECT_URI,
		scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'openid']
	});
};

export const getDiscordAuth = (auth: Lucia.Auth) => {
	return discord(auth, {
		clientId: DISCORD_CLIENT_ID,
		clientSecret: DISCORD_CLIENT_SECRET,
		redirectUri: DISCORD_REDIRECT_URI,
		scope: ['identify', 'email']
	});
};
