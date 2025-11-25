import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ parent }) => {
	const { user } = await parent();
	if (!user.isAdmin) {
		throw error(401, { message: 'Användare är inte admin' });
	}
	return { user };
};
