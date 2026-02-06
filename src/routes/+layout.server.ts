import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { auth } from '@/lib/auth';
import type { User } from '@/models/user.model';
import { populateUser } from '@/helpers/user.helpers';
import { postHistoryInRange } from '$lib/ekorre';
import { PENGAMASTARE_POST_ID } from "@/constants/user.constants"
import { config } from '@/config.private';

export const load: LayoutServerLoad = async (event) => {
	const { user } = await auth.serverLoad(event);

	const now = new Date()
	let isPengUChief = false
	// januari (0) & februari (1)
	if (now.getMonth() <= 1) {
		const pengamästares = await postHistoryInRange(config.EKORRE_URL.includes("localhost") ? 4 : PENGAMASTARE_POST_ID, new Date(now.getFullYear() - 1, 11, 20), new Date(now.getFullYear() - 1, 11, 21))
		if (pengamästares.history.findIndex((pm) => pm.holder.username == user?.username) != -1) {
			isPengUChief = true
		}
	}

	if (!user) {
		throw redirect(302, '/auth/log-in');
	}
	const fullUser: User = populateUser(user, isPengUChief);
	if (!fullUser.verified) {
		throw error(401, 'Användaren är inte verifierad. Verifiera dig via https://esek.se/account');
	}
	return { user: fullUser };
};
