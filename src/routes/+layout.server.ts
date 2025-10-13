import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { auth } from '@/lib/auth';
import { isAdmin, isPengU } from '@/helpers/user.helpers';

export const load: LayoutServerLoad = async (event) => {
	const { user } = await auth.serverLoad(event);
	if (!user) {
		throw redirect(302, '/auth/log-in');
	}
	const fullUser = { ...user, isPengU: isPengU(user), isAdmin: isAdmin(user) };
	if (!fullUser.verified) {
		throw error(401, 'Användaren är inte verifierad. Verifiera dig via https://esek.se/account');
	}
	return { user: fullUser };
};
