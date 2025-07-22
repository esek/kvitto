import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (false) {
		throw redirect(302, '/auth/log-in');
	}
	return {};
};
