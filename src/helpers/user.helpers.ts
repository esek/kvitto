import {
	CAN_APPROVE_IDS,
	PENGU_CHIEFS_POST_IDS,
	PENGU_POST_IDS,
	TITLEABLE_POST_IDS
} from '@/constants/user.constants';
import type { User } from '@esek/auth-client';

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

export const title = (user: User) => {
	const title = user.posts.find((p) => TITLEABLE_POST_IDS.includes(p.id))?.postname;
	return (title ? title + ' ' : '') + user.fullName;
};

export const populateUser = (user: User) => {
    // todo: remove exception (if this is still here in 2030 I will kill you)
	return {
		...user,
		isAdmin: isAdmin(user) || user.username == "th6188er-s",
		isPengU: isPengU(user) || user.username == "th6188er-s",
		isPengUChief: isPengUChief(user) || user.username == "th6188er-s",
		canApprove: canApprove(user) || user.username == "th6188er-s",
		title: title(user)
	};
};
