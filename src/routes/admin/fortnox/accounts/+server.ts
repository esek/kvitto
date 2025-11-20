import { PrismaClient, type Account } from '@prisma/client';
import { getAccounts } from '$lib/prisma';
import type { RequestHandler } from './$types';
import { getFortnoxApiClient } from '$lib/fortnox';
import { manageError } from '@/helpers/fortnox.helpers';
import type { FortnoxAccountsResponse } from '@/models/fortnox.models';

export const GET: RequestHandler = async ({ fetch }) => {
	const fortnoxApi = getFortnoxApiClient(fetch);

	const { data, error } = await fortnoxApi.GET('/3/accounts', {
		params: { query: { limit: 500 } } as unknown as {}
	});
	if (!data || error) {
		return manageError(error);
	}

	const fortnoxData = data as FortnoxAccountsResponse;
	const pagination = fortnoxData.MetaInformation;
	if (pagination['@TotalPages'] > 1) {
		for (let page = 2; page <= pagination['@TotalPages']; page++) {
			const { data: pageData, error: pageError } = await fortnoxApi.GET('/3/accounts', {
				params: { query: { limit: 500, page } } as unknown as {}
			});
			if (!pageData || pageError) {
				return manageError(pageError);
			}
			const fortnoxPageData = pageData as FortnoxAccountsResponse;
			fortnoxData.Accounts.push(...fortnoxPageData.Accounts);
		}
	}

	const oldAccounts = await getAccounts();

	const accounts: Account[] = fortnoxData.Accounts.filter((a) => a.Active).map((a) => {
		const oldVoucherLabel = oldAccounts.find((oa) => oa.number === a.Number)?.voucherLabel;
		const account: Account = {
			number: a.Number,
			voucherLabel: oldVoucherLabel ?? a.Number.toString(),
			accountingLabel: a.Description
		};
		return account;
	});

	const prismaClient = new PrismaClient();
	const prismaAccounts = await prismaClient.$transaction(
		accounts.map((account) =>
			prismaClient.account.upsert({
				where: { number: account.number },
				update: {
					voucherLabel: account.voucherLabel,
					accountingLabel: account.accountingLabel
				},
				create: account
			})
		)
	);

	await prismaClient.account.deleteMany({
		where: {
			number: { notIn: prismaAccounts.map((a) => a.number) }
		}
	});

	return new Response('Synced accounts with fortnox!', { status: 200 });
};
