import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database';

export const load: PageServerLoad = async () => {
	console.log('load from routes/users/+page.server.ts');

	const results = await db.query.users.findMany({
		with: { providers: true }
	});

	return {
		users: results
	};
};
