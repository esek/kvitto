import { env } from '$env/dynamic/public';

export const config = {
	BODY_SIZE_LIMIT: env.PUBLIC_BODY_SIZE_LIMIT ? parseInt(env.PUBLIC_BODY_SIZE_LIMIT) : 10485760
};
