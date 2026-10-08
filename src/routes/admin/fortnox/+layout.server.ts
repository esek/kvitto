import type { LayoutServerLoad } from './$types';
import { requireFortnoxSession } from '$lib/server/fortnox-session';

export const load: LayoutServerLoad = async (event) => {
	await requireFortnoxSession(event);
	return {};
};
