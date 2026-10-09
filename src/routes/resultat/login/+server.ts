import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fortnoxAuthClient } from '$lib/fortnox';
import { requireResultatUser } from '$lib/server/resultat-auth';
import Routes from '@/constants/routes.constants';

export const GET: RequestHandler = async (event) => {
	await requireResultatUser(event);
	const state = `resultat:${crypto.randomUUID()}`;
	event.cookies.set('fortnox_resultat_state', state, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: 600
	});
	// Reuse the registered callback URL, but isolate state and scope from admin login.
	const authorizationUrl = new URL(
		fortnoxAuthClient.authorizeURL({
			redirect_uri: event.url.origin + Routes.FortnoxCallback,
			scope: 'bookkeeping',
			state
		})
	);
	authorizationUrl.searchParams.set('access_type', 'offline');
	redirect(302, authorizationUrl.toString().replaceAll('+', encodeURIComponent(' ')));
};
