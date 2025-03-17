import { isAdmin } from '@/helpers/user.helpers';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ parent }) => {
	const { user } = await parent();
	if (!isAdmin(user)) {
		throw error(401, { message: 'Användare är inte admin' });
	}
	return { user };
};
