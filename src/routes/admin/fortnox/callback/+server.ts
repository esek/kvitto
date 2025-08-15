import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fortnoxAuthClient } from '$lib/fortnox';
import Routes from '@/constants/routes.constants';
import { createSession, deleteSession } from '$lib/sessions';
import { getOAuth2Redirect } from '@/helpers/url.helpers';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const params = url.searchParams;
	const code = params.get('code');
	if (!code) {
		throw error(400, 'Saknar kod');
	}

	const tokenParams = {
		code: code,
		redirect_uri: getOAuth2Redirect(url, url.origin + Routes.FortnoxCallback),
		grant_type: 'authorization_code'
	};

	const accessToken = await fortnoxAuthClient.getToken(tokenParams);

	const oldSession = cookies.get('fortnox_session_id');
	if (oldSession) {
		deleteSession(oldSession);
	}

	const sessionId = createSession(accessToken.token);
	cookies.set('fortnox_session_id', sessionId, {
		path: '/',
		httpOnly: !dev,
		secure: !dev,
		sameSite: 'lax'
	});

	const csrf_token = crypto.randomUUID();
	cookies.set('fortnox_csrf_token', csrf_token, {
		path: '/',
		httpOnly: false, // frontend must access it
		secure: !dev,
		sameSite: 'lax'
	});

	throw redirect(303, url.searchParams.get('redirect_uri') ?? Routes.Fortnox);
};
