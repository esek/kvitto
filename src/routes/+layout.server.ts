import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { auth } from '@/lib/auth';
import type { User } from '@/models/user.models';

export const load: LayoutServerLoad = async (event) => {
	const { user } = await auth.serverLoad(event);
	if (!user) {
		throw redirect(302, '/auth/log-in');
	}
	return { user: user as User };
};
