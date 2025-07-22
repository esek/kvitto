import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { auth } from '@/lib/auth';
import type { User } from '@/models/user.models';

export const load: LayoutServerLoad = async (event) => {
	const { user } = await auth.serverLoad(event);
	if (!user) {
		throw redirect(302, '/auth/log-in');
	}
	const fullUser = { ...user, isPengU: user.posts.some((p) => p.utskott === 'PENGU') } as User;
	if (!fullUser.verified) {
		throw error(401, 'Användare är inte verifierad. Verifiera dig via https://esek.se/account');
	}
	return { user: fullUser };
};
