import { PrismaClient, type Account } from '@prisma/client';
import { getAccounts } from '$lib/prisma';
import type { RequestHandler } from './$types';
import { getFortnoxApiClient } from '$lib/fortnox';
import { manageError } from '@/helpers/fortnox.helpers';

export const GET: RequestHandler = async ({ fetch }) => {
	const fortnoxApi = getFortnoxApiClient(fetch);

	const { data, error } = await fortnoxApi.GET('/3/accounts', {
		params: { query: { limit: 500 } } as unknown as {}
	});

	if (!data || error) {
		return manageError(error);
	}

	if (!data.Accounts) {
		return new Response('Found no fortnox accounts.', { status: 404 });
	}

	const oldAccounts = await getAccounts();

	const accounts: Account[] = data.Accounts.filter((a) => a.Active).map((a) => {
		const oldVoucherLabel = oldAccounts.find((oa) => oa.number === a.Number)?.voucherLabel;
		const account: Account = {
			number: a.Number,
			voucherLabel: oldVoucherLabel ?? a.Number.toString(),
			accountingLabel: a.Description
		};
		return account;
	});

	const prismaClient = new PrismaClient();
	prismaClient.$transaction([
		prismaClient.account.deleteMany(),
		prismaClient.account.createMany({ data: accounts })
	]);
	return new Response('Synced accounts with fortnox!', { status: 200 });
};
