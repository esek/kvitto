import type { User as EsekUser } from '@esek/auth-client';

//the npm package is outdated and we know some fields exist
//on a user that the package doesn't believe are there
export type User = EsekUser & {
	fullName: string;
};
