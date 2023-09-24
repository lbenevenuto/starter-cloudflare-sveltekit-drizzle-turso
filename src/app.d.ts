// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { AuthRequest, Session } from 'lucia';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('$lib/server/lucia').Auth;
			AuthRequest: AuthRequest;
			session?: Session | null;
		}
		// interface PageData {}
		interface Platform {
			env: {
				KV_SESSIONS: KVNamespace;
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			username: string;
			email: string;
			email_verified: boolean;
		};
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};
