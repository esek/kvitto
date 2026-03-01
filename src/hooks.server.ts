import { auth } from './lib/auth';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { getFortnoxAccessToken } from '$lib/fortnox';
import { config } from './config.private';

export const handle: Handle = async ({ event, resolve }) => {
	// This if statement is nothing more than a reflection of human insecurity and its relation,
	// and proportionality, to the size and strangeness of terminal outputs.
	// Chrome asks if we support any special features, we now catch this question and nicely
	// tells Chrome to fuck off. If we didnt handle this. the only effect is that our console
	// will log an error looking response after the EOAuthHandler fails to handle the weird pathname.
	// Note: All the EOAuthHandler does is run the resolve function on the event, so this is most
	// likely a dependency issue between our auth-client and svelte because one of theses guys should
	// know what to do when this pathname shows up.
	if (event.url.pathname.startsWith('/.well-known/')) {
		return new Response(null, { status: 204 });
	}

	return await auth.handle({ event, resolve });
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const accessToken = getFortnoxAccessToken(event.cookies);
	if (request.url.startsWith('https://api.fortnox.se/') && accessToken) {
		request.headers.set('authorization', `Bearer ${accessToken.token.access_token}`);
		request.headers.set('client-id', config.FORTNOX_CLIENT_ID);
	}

	if (request.url.startsWith(config.KVITTOHAKE_URL)) {
		request.headers.set('authorization', `${config.KVITTOHAKE_AUTH_SECRET}`);
	}

	return fetch(request);
};
