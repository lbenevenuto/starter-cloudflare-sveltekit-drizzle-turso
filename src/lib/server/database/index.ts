import * as schema from '$lib/database/schema';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client/web';
import { DATABASE_URL, DATABASE_AUTH_TOKEN, ENABLE_DRIZZLE_LOGGER } from '$env/static/private';
import { dev } from '$app/environment';

export const client = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });

export const db = drizzle(client, { schema, logger: ENABLE_DRIZZLE_LOGGER ? Boolean(ENABLE_DRIZZLE_LOGGER) : dev });
