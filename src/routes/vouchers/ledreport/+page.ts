import { defaultLedReport } from '@/constants/voucher.constants';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { accounts } = await parent();
	const ledreport = defaultLedReport();

	return {
		ledreport: ledreport,
		accounts: accounts
	};
}) satisfies PageLoad;
