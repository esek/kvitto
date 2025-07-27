import type { PageServerLoad } from './$types';
import { getSession } from '$lib/sessions';
import { redirect } from '@sveltejs/kit';
import Routes from '@/constants/routes.constants';
import { fortnoxClient } from '$lib/fortnox';

export const load = (async ({ cookies, fetch }) => {
	const sessionId = cookies.get('fortnox_session_id');
	const session = getSession(sessionId);
	if (!session || !sessionId) {
		throw redirect(303, Routes.FortnoxLogin);
	}

	const accessToken = fortnoxClient.createToken(session);
	if (accessToken.expired()) {
		const csrfToken = cookies.get('fortnox_csrf_token');
		const res = await fetch(Routes.FortnoxRefresh, {
			method: 'POST',
			headers: {
				'x-csrf-token': csrfToken ?? ''
			}
		});
		if (!res.ok) {
			throw redirect(303, Routes.FortnoxLogin);
		}
	}

	return {};
}) satisfies PageServerLoad;
