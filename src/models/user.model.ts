import type { User as EsekUser } from '@esek/auth-client';

export type User = EsekUser & {
	isPengU: boolean;
	isAdmin: boolean;
	isPengUChief: boolean;
	canApprove: boolean;
	title: string;
};
