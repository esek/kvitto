import { redirect } from '@sveltejs/kit';
import Routes from '@/constants/routes.constants';
import { getFortnoxAccessToken } from '$lib/fortnox';
import type { LayoutServerLoad } from './$types';
import { addRedirect, getOAuth2Redirect } from '@/helpers/url.helpers';
export const load = (async ({ cookies, fetch, url }) => {
	//add the url as its own redirect since, here in the layout,
	//the url could also possibly be a child route.
	const OAuth2Redirect = addRedirect(url, url.toString());
	const loginWithLoopback = getOAuth2Redirect(OAuth2Redirect, Routes.FortnoxLogin);

	const accessToken = getFortnoxAccessToken(cookies);
	if (!accessToken) {
		throw redirect(302, loginWithLoopback);
	}

	if (accessToken.expired(60 * 10)) {
		// try refreshing the token, else just log in again
		const csrfToken = cookies.get('fortnox_csrf_token');
		const res = await fetch(Routes.FortnoxRefresh, {
			method: 'POST',
			headers: {
				'x-csrf-token': csrfToken ?? ''
			}
		});
		if (!res.ok) {
			throw redirect(302, loginWithLoopback);
		}
	}

	return {};
}) satisfies LayoutServerLoad;
