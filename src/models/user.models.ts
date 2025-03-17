import type { User as EsekUser } from '@esek/auth-client';

export type User = EsekUser & {
	fullName: string;
};
