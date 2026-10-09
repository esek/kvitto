import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fortnoxAuthClient } from '$lib/fortnox';
import Routes from '@/constants/routes.constants';
import { createSession, deleteSession } from '$lib/sessions';
import { getOAuth2Redirect } from '@/helpers/url.helpers';
import { dev } from '$app/environment';
import { requireResultatUser } from '$lib/server/resultat-auth';
import { setResultatConnection } from '$lib/server/resultat-connection';

export const GET: RequestHandler = async (event) => {
	const { url, cookies } = event;
	// Resultat uses its own global, minimal-scope connection. Leave admin cookies alone.
	if (url.searchParams.get('state')?.startsWith('resultat:')) {
		await requireResultatUser(event);
		const state = cookies.get('fortnox_resultat_state');
		cookies.delete('fortnox_resultat_state', { path: '/' });
		if (!state || state !== url.searchParams.get('state'))
			error(400, 'Ogiltig Fortnox-inloggning. Försök igen.');
		const code = url.searchParams.get('code');
		if (!code) error(400, 'Fortnox-inloggningen avbröts eller saknar kod.');
		try {
			const token = await fortnoxAuthClient.getToken({
				code,
				redirect_uri: url.origin + Routes.FortnoxCallback
			});
			setResultatConnection(token);
		} catch {
			error(502, 'Kunde inte ansluta Fortnox med endast bokföringsbehörighet. Försök igen.');
		}
		redirect(302, Routes.Resultat);
	}
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

	throw redirect(302, url.searchParams.get('redirect_uri') ?? Routes.Fortnox);
};
