// src/lib/server/fortnox-oauth.ts
import { config } from '@/config.private';
import type { paths } from '@/models/openapi/fortnox/schema';
import type { Cookies } from '@sveltejs/kit';
import createClient, { type Client } from 'openapi-fetch';
import { AuthorizationCode, type AccessToken } from 'simple-oauth2';
import { getSession } from './sessions';

const client = new AuthorizationCode({
	client: {
		id: config.FORTNOX_CLIENT_ID,
		secret: config.FORTNOX_CLIENT_SECRET
	},
	auth: {
		tokenHost: 'https://apps.fortnox.se',
		authorizePath: '/oauth-v1/auth',
		tokenPath: 'oauth-v1/token'
	}
});

export const fortnoxAuthClient = client;

export const getFortnoxApiClient = (
	svelteFetchInstance: (input: Request) => Promise<Response>
): Client<paths, `${string}/${string}`> =>
	createClient<paths>({
		baseUrl: 'https://api.fortnox.se',
		fetch: svelteFetchInstance
	});

export const getFortnoxAccessToken = (cookies: Cookies): AccessToken | null => {
	const sessionId = cookies.get('fortnox_session_id');
	const session = getSession(sessionId);
	if (!session || !sessionId) {
		return null;
	}
	return fortnoxAuthClient.createToken(session);
};
