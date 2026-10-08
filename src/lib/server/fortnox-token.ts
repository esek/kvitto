import type { AccessToken } from 'simple-oauth2';
import { fortnoxAuthClient } from '$lib/fortnox';
import { getSession, updateSession } from '$lib/sessions';

// Browser refreshes and the midnight job must not rotate the same refresh token twice.
const refreshing = new Map<string, Promise<AccessToken | null>>();

export async function getValidFortnoxToken(sessionId: string, forceRefresh = false) {
	const pending = refreshing.get(sessionId);
	if (pending) return pending;
	const session = getSession(sessionId);
	if (!session) return null;
	const token = fortnoxAuthClient.createToken(session);
	if (!forceRefresh && !token.expired(60 * 10)) return token;
	const refresh = token
		.refresh()
		.then((updated) => {
			if (!getSession(sessionId)) return null;
			updateSession(sessionId, updated.token);
			return updated;
		})
		.finally(() => refreshing.delete(sessionId));
	refreshing.set(sessionId, refresh);
	return refresh;
}
