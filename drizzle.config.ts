import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
	schema: './src/lib/database/schema/*',
	out: './migrations',
	driver: 'turso',
	dbCredentials: {
		url: process.env.DATABASE_URL ?? '',
		authToken: process.env.DATABASE_AUTH_TOKEN ?? ''
	},
	verbose: true
} satisfies Config;
