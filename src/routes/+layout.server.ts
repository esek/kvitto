import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { auth } from '@/lib/auth';
import type { User } from '@/models/user.model';
import { populateUser } from '@/helpers/user.helpers';

export const load: LayoutServerLoad = async (event) => {
	const { user } = await auth.serverLoad(event);

	if (!user) {
		throw redirect(302, '/auth/log-in');
	}
	const fullUser: User = await populateUser(user);
	// TODO(revert): right now (2026-08-27) the esek ips are blacklisted from medcheck which means
	// users cannot verify. This is bad because all mentors (phaddrar) use kvitto to hand in receipts
	// from the nollning.
	//
	// if (!fullUser.verified) {
	// 	throw error(401, 'Användaren är inte verifierad. Verifiera dig via https://esek.se/account');
	// }
	return { user: fullUser };
};
