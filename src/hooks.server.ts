import { auth } from './lib/auth';
import { getSession } from '$lib/sessions';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// This if statement is nothing more than a reflection of human security being dependent on,
	// and specifically inversely proportional to, the size and strangeness of terminal outputs.
	// Chrome asks if we support any special features, we now catch this question and nicely
	// tells Chrome to fuck off. If we didnt handle this. the only effect is that our console
	// will log an error looking response after the EOAuthHandler fails to handle the weird pathname.
	// Note: All the EOAuthHandler does is run the resolve function on the event, so this is most
	// likely a dependency issue between our auth-client and svelte because one of theses guys should
	// know what to do when this pathname shows up.
	if (event.url.pathname.startsWith('/.well-known/')) {
		return new Response(null, { status: 204 });
	}
	const ESekResponse = await auth.handle({ event, resolve });

	const fortnoxSessionId = event.cookies.get('fortnox_session_id');
	const session = getSession(fortnoxSessionId);
	event.locals.fortnox = session;
	return ESekResponse;
};
