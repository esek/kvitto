import { defaultDriversExpense, defaultVoucher } from '@/constants/voucher.constants';
import type { PageLoad } from './$types';
import { VoucherSeries } from '@prisma/client';
import type { DriversExpenseType, VoucherType } from '@/models/voucher.models';
import { getAccountOptionsForVouchers } from '@/helpers/voucher.helpers';

export const load = (async ({ parent }) => {
	const { accounts } = await parent();
	const supplierInvoiceVoucher = defaultVoucher({
		series: VoucherSeries.L,
		driversExpense: defaultDriversExpense({})
	}) as VoucherType & { driversExpense: DriversExpenseType };

	return {
		voucher: supplierInvoiceVoucher,
		accounts: getAccountOptionsForVouchers(accounts)
	};
}) satisfies PageLoad;
