import { env } from '$env/dynamic/private';

export const config = {
	AUTH_URL: env.AUTH_URL || '',
	EMAIL_URL: env.EMAIL_URL || '',
	EMAIL_API_KEY: env.EMAIL_API_KEY || '',
	DEPLOY_URL: env.DEPLOY_URL || '',
	FORTNOX_CLIENT_ID: env.FORTNOX_CLIENT_ID || '',
	FORTNOX_CLIENT_SECRET: env.FORTNOX_CLIENT_SECRET || '',
	KVITTOHAKE_URL: env.KVITTOHAKE_URL || '',
	KVITTOHAKE_AUTH_SECRET: env.KVITTOHAKE_AUTH_SECRET || '',
	EKORRE_URL: env.EKORRE_URL || '',
	EKORRE_API_KEY: env.EKORRE_API_KEY || ''
};
