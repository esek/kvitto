// src/routes/login/+server.ts
import { fortnoxAuthClient } from '$lib/fortnox';
import Routes from '@/constants/routes.constants';
import { getOAuth2Redirect } from '@/helpers/url.helpers';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const authorizationUri = fortnoxAuthClient
		.authorizeURL({
			redirect_uri: getOAuth2Redirect(url, url.origin + Routes.FortnoxCallback),
			scope: [
				'bookkeeping',
				'costcenter',
				'project',
				'supplierinvoice',
				'connectfile',
				'supplier',
				'inbox'
			].join(' '),
			state: crypto.randomUUID()
		})
		.replaceAll('+', encodeURIComponent(' '));

	return new Response(null, {
		status: 302,
		headers: {
			Location: authorizationUri
		}
	});
};
