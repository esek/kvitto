import { PUBLIC_BODY_SIZE_LIMIT } from '$env/static/public';

export const config = {
	BODY_SIZE_LIMIT: PUBLIC_BODY_SIZE_LIMIT ? parseInt(PUBLIC_BODY_SIZE_LIMIT.toString()) : 10485760
};
