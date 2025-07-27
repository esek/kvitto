// src/routes/refresh/+server.ts
import { fortnoxClient } from '$lib/fortnox';
import { getSession, updateSession } from '$lib/sessions';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies, request }) => {
	const csrf_header = request.headers.get('x-csrf-token');
	const csrf_cookie = cookies.get('fortnox_csrf_token');
	if (!csrf_header || csrf_header !== csrf_cookie) {
		return new Response('Invalid CSRF token', { status: 403 });
	}

	const session_id = cookies.get('fortnox_session_id');
	const session = getSession(session_id);
	if (!session || !session_id) return new Response('No session', { status: 401 });

	const accesToken = await fortnoxClient.createToken(session).refresh();
	updateSession(session_id, accesToken.token);

	return new Response('Token refreshed');
};
