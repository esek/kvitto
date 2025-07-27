// src/lib/server/fortnox-oauth.ts
import { config } from '@/config.private';
import { AuthorizationCode } from 'simple-oauth2';

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

export const fortnoxClient = client;
