import { dev } from '$app/environment';
import { config } from '@/config';
import { EOAuth2Handler } from '@esek/auth-client';

export const auth = new EOAuth2Handler({
	authUrl: config.AUTH_URL,
	isDev: dev
});
