import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { auth } from '@/lib/auth';

export const load: LayoutServerLoad = async (event) => {
	const { user } = await auth.serverLoad(event);
	if (!user) {
		throw redirect(302, '/auth/log-in');
	}
	if (!user.verified) {
		throw error(401, 'Användare är inte verifierad. Verifiera dig via https://esek.se/account');
	}
	const doconfetti = event.url.searchParams.get('confetti') != null;
	return { user, doconfetti };
};
