// src/routes/refresh/+server.ts
import { getValidFortnoxToken } from '$lib/server/fortnox-token';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies, request }) => {
	const csrf_header = request.headers.get('x-csrf-token');
	const csrf_cookie = cookies.get('fortnox_csrf_token');
	if (!csrf_header || csrf_header !== csrf_cookie) {
		return new Response('Invalid CSRF token', { status: 403 });
	}

	const session_id = cookies.get('fortnox_session_id');
	if (!session_id) return new Response('No session', { status: 401 });
	try {
		if (!(await getValidFortnoxToken(session_id, true)))
			return new Response('No session', { status: 401 });
	} catch {
		return new Response('Fortnox session could not be refreshed', { status: 401 });
	}

	return new Response('Token refreshed');
};
