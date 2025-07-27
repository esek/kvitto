// src/routes/login/+server.ts
import { fortnoxClient } from '$lib/fortnox';
import Routes from '@/constants/routes.constants';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const authorizationUri = fortnoxClient.authorizeURL({
		redirect_uri: url.origin + Routes.FortnoxCallback,
		scope: 'companyinformation',
		state: crypto.randomUUID()
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: authorizationUri
		}
	});
};
