import { redirect, type RequestEvent } from '@sveltejs/kit';
import Routes from '@/constants/routes.constants';
import { getFortnoxAccessToken } from '$lib/fortnox';

// Admin operations retain their per-browser Fortnox session and refresh flow.
export async function ensureFortnoxSession({
	cookies,
	fetch
}: Pick<RequestEvent, 'cookies' | 'fetch'>) {
	const accessToken = getFortnoxAccessToken(cookies);
	if (!accessToken) return false;
	if (accessToken.expired(60 * 10)) {
		const response = await fetch(Routes.FortnoxRefresh, {
			method: 'POST',
			headers: { 'x-csrf-token': cookies.get('fortnox_csrf_token') ?? '' }
		}).catch(() => null);
		if (!response?.ok) return false;
	}
	return true;
}

export async function requireFortnoxSession(
	event: Pick<RequestEvent, 'cookies' | 'fetch' | 'url'>
) {
	if (!(await ensureFortnoxSession(event))) {
		redirect(
			302,
			`${Routes.FortnoxLogin}?redirect_uri=${encodeURIComponent(event.url.toString())}`
		);
	}
}
