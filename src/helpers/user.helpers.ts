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
	return user.posts.some((p) => p.utskott !== 'PENGU');
};
