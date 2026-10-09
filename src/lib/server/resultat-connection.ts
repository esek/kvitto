import type { AccessToken } from 'simple-oauth2';
import { config } from '@/config.private';
import { getFortnoxApiClient } from '$lib/fortnox';
import { FortnoxReportError } from './resultat';

// Reports share one bookkeeping-only connection across devices. Never reuse the
// broader per-browser admin tokens: supplier/inbox/etc. permissions must not
// become global. Fortnox's bookkeeping scope itself includes writes, so this
// client additionally allows only the GET endpoints used by the report.
// Both tokens live only in server memory; a restart requires reconnection.
type Connection = { id: string; token: AccessToken; refreshing?: Promise<AccessToken> };
let connection: Connection | undefined;

function checkReportScope(token: AccessToken) {
	const scopes = typeof token.token.scope === 'string' ? token.token.scope.trim().split(/\s+/) : [];
	if (scopes.length !== 1 || scopes[0] !== 'bookkeeping')
		throw new Error('Fortnox måste bevilja endast bookkeeping för resultatanslutningen.');
}

export function setResultatConnection(token: AccessToken) {
	checkReportScope(token);
	connection = { id: crypto.randomUUID(), token };
}

async function validToken(current: Connection) {
	if (connection !== current)
		throw new FortnoxReportError('Resultatanslutningen har ersatts.', 401);
	if (current.refreshing) return current.refreshing;
	if (!current.token.expired(60 * 10)) return current.token;
	current.refreshing = current.token
		.refresh()
		.then((token) => {
			checkReportScope(token);
			if (connection !== current)
				throw new FortnoxReportError('Resultatanslutningen har ersatts.', 401);
			current.token = token;
			return token;
		})
		.finally(() => {
			current.refreshing = undefined;
		});
	return current.refreshing;
}

export async function getResultatConnection() {
	const current = connection;
	if (!current) return null;
	try {
		await validToken(current);
	} catch {
		return null;
	}
	const api = getFortnoxApiClient(async (request) => {
		const url = new URL(request.url);
		if (
			request.method !== 'GET' ||
			url.origin !== 'https://api.fortnox.se' ||
			!/^\/3\/(financialyears|vouchers(?:\/[^/]+\/[^/]+)?)$/.test(url.pathname)
		)
			throw new Error('Otillåtet anrop från resultatanslutningen.');
		let token: AccessToken;
		try {
			token = await validToken(current);
		} catch {
			throw new FortnoxReportError('Resultatanslutningen behöver förnyas.', 401);
		}
		request.headers.set('authorization', `Bearer ${token.token.access_token}`);
		request.headers.set('client-id', config.FORTNOX_CLIENT_ID);
		// Global fetch deliberately bypasses handleFetch, which attaches the
		// browser's broader admin credentials to event.fetch requests.
		return fetch(request, { redirect: 'error' });
	});
	return { id: current.id, api };
}
