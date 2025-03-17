import { getAccounts } from '$lib/prisma';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	const accounts = await getAccounts();
	return {
		accounts
	};
}) satisfies LayoutServerLoad;
