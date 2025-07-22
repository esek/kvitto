import { defaultExpenseReport, defaultVoucher } from '@/constants/voucher.constants';
import type { PageLoad } from './$types';
import { VoucherSeries } from '@prisma/client';
import type { ExpenseReportType, VoucherType } from '@/models/voucher.models';
import { getAccountOptionsForVouchers } from '@/helpers/voucher.helpers';

export const load = (async ({ parent }) => {
	const { user, accounts } = await parent();
	const expenseReportVoucher = defaultVoucher({
		series: VoucherSeries.B,
		expenseReport: defaultExpenseReport({
			name: user.fullName
		})
	}) as VoucherType & { expenseReport: ExpenseReportType };

	return {
		voucher: expenseReportVoucher,
		accounts: getAccountOptionsForVouchers(accounts)
	};
}) satisfies PageLoad;
