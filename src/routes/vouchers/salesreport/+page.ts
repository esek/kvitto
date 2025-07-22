import { defaultSalesReport, defaultVoucher } from '@/constants/voucher.constants';
import type { PageLoad } from './$types';
import { VoucherSeries } from '@prisma/client';
import type { SalesReportType, VoucherType } from '@/models/voucher.models';
import { getAccountOptionsForVouchers } from '@/helpers/voucher.helpers';

export const load = (async ({ parent }) => {
	const { user, accounts } = await parent();
	const expenseReportVoucher = defaultVoucher({
		series: VoucherSeries.B,
		reference: user.fullName,
		salesReport: defaultSalesReport()
	}) as VoucherType & { salesReport: SalesReportType };

	return {
		voucher: expenseReportVoucher,
		accounts: getAccountOptionsForVouchers(accounts)
	};
}) satisfies PageLoad;
