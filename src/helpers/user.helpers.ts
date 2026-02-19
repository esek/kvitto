import {
	CAN_APPROVE_IDS,
	PENGU_CHIEFS_POST_IDS,
	PENGU_POST_IDS,
	TITLEABLE_POST_IDS
} from '@/constants/user.constants';
import type { User } from '@esek/auth-client';
import type { User as FatUser } from '@/models/user.model';
import { env } from '$env/dynamic/public';
import { postHistoryInRange } from '$lib/ekorre';
import { PENGAMASTARE_POST_ID } from "@/constants/user.constants"
import { config } from '@/config.private';

export const isAdmin = (user: User | null) => {
	if (!user?.access?.features) {
		return false;
	}
	return user.access.features.some(
		(f) => f === 'superadmin' || (f as string) === 'accounting_admin'
	);
};

const hasId = (user: User, idList: number[]) => {
	return user.posts.some((p) => idList.includes(p.id));
};

export const canApprove = (user: User | null) => {
	if (!user) {
		return false;
	}
	return hasId(user, CAN_APPROVE_IDS);
};

export const isPengUChief = (user: User | null) => {
	if (!user) {
		return false;
	}
	return hasId(user, PENGU_CHIEFS_POST_IDS);
};

export const isPengU = (user: User | null) => {
	if (!user) {
		return false;
	}
	//Could look for utskott on user.posts as well but this is for protection against
	//users who want to gain access by adding pengu to their posts manually from the website
	return hasId(user, PENGU_POST_IDS);
};
export const isPrevPengUChief = async (user: User) => {
	const now = new Date()
	// januari (0) & februari (1)
	if (now.getMonth() <= 1) {
        const pengUChiefId = config.EKORRE_URL.includes("localhost") ? 4 : PENGAMASTARE_POST_ID
		const pengUChief = await postHistoryInRange(
            pengUChiefId,
            new Date(now.getFullYear() - 1, 11, 20),
            new Date(now.getFullYear() - 1, 11, 21)
        )
		if (pengUChief.history.findIndex((pm) => pm.holder.username == user?.username) != -1) {
			return true
		}
	}
	return false
}

export const title = (user: User) => {
	const title = user.posts.find((p) => TITLEABLE_POST_IDS.includes(p.id))?.postname;
	return (title ? title + ' ' : '') + user.fullName;
};

export const populateUser = async (user: User): Promise<FatUser> => {
	const isTesting = env.PUBLIC_ENV === "testing"

	const giveAllPermissions = isTesting || await isPrevPengUChief(user)

	return {
		...user,
		verified: user.verified || giveAllPermissions,
		isAdmin: isAdmin(user) || giveAllPermissions,
		isPengU: isPengU(user) || giveAllPermissions,
		isPengUChief: isPengUChief(user) || giveAllPermissions,
		canApprove: canApprove(user) || giveAllPermissions,
		title: title(user)
	};
};
