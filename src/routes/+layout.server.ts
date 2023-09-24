import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	console.log('load from routes/+layout.server.ts');

	return {
		user: locals.session?.user
	};
};
