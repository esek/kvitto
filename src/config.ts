import { env } from '$env/dynamic/private';

export const config = {
	AUTH_URL: env.AUTH_URL ?? 'http://localhost:3001',
	MINIO_URL: env.MINIO_URL ?? 'http://localhost:9000',
	MINIO_ACCESS_KEY: env.MINIO_ACCESS_KEY ?? '123abc',
	MINIO_SECRET_KEY: env.MINIO_SECRET_KEY ?? '123abc',
	EMAIL_URL: env.EMAIL_URL ?? 'http://localhost:3002',
	EMAIL_API_KEY: env.EMAIL_API_KEY ?? 'api-key',
	DEPLOY_URL: env.DEPLOY_URL ?? 'test.esek.se',
	CHAIRMAN_EMAIL: env.CHAIRMAN_EMAIL ?? 'email@example.com',
	WEBHOOK_URLS: env.WEBHOOK_URLS ?? ''
};
