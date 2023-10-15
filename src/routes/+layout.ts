import { browser } from '$app/environment';
import { posthog } from 'posthog-js';
import type { LayoutLoad } from './$types';
import { PUBLIC_POSTHOG_API_HOST, PUBLIC_POSTHOG_API_KEY } from '$env/static/public';

export const load = (async ({ data }) => {
	console.log('layout load');
	console.log(data);

	if (browser) {
		posthog.init(PUBLIC_POSTHOG_API_KEY, {
			api_host: PUBLIC_POSTHOG_API_HOST,
			loaded: function (posthog) {
				if (data.user && data.user.userId) {
					posthog.identify(data.user.userId.toString(), {
						username: data.user.username,
						userRole: data.user.role
					});
				}
			}
		});
	}
	return { ...data };
}) satisfies LayoutLoad;
