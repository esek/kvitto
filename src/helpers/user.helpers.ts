import type { User } from '@esek/auth-client';

export const isAdmin = (user: User | null) => {
	if (!user?.access?.features) {
		return false;
	}
	return user.access.features.some(
		(f) => f === 'superadmin' || (f as string) === 'accounting_admin'
	);
};

export const isPengU = (user: User | null) => {
	if (!user) {
		return false;
	}
	return user.posts.some((p) => p.utskott === 'PENGU' || p.id === 118 || p.id === 1);
};

//118 is pengamästare
// 1 is macapär OMEGALUL
//31 is cophös because nollu_ekonomi
const TITLEABLE_POST_IDS = [
	1, 4, 5, 30, 16, 39, 28, 34, 66, 109, 17, 112, 118, 9, 42, 119, 130, 31
];

export const title = (user: User) => {
	const title = user.posts.find((p) => p.id in TITLEABLE_POST_IDS)?.postname;
	return (title ? title + ' ' : '') + user.fullName;
};
