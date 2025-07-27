import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fortnoxClient } from '$lib/fortnox';
import Routes from '@/constants/routes.constants';
import { createSession } from '$lib/sessions';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const params = url.searchParams;
	const code = params.get('code');
	if (!code) {
		throw error(400, 'Saknar kod');
	}

	const tokenParams = {
		code: code,
		redirect_uri: url.origin + Routes.FortnoxCallback,
		grant_type: 'authorization_code'
	};

	const accessToken = await fortnoxClient.getToken(tokenParams);
	const sessionId = createSession(accessToken.token);

	const csrf_token = crypto.randomUUID();

	cookies.set('fortnox_session_id', sessionId, {
		path: '../',
		httpOnly: !dev,
		secure: !dev,
		sameSite: 'strict'
	});

	cookies.set('fortnox_csrf_token', csrf_token, {
		path: '../',
		httpOnly: false, // frontend must access it
		secure: !dev,
		sameSite: 'strict'
	});

	throw redirect(303, Routes.Fortnox);
};
