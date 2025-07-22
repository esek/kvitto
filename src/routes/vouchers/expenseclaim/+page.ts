import { defaultExpenseClaim, defaultVoucher } from '@/constants/voucher.constants';
import type { PageLoad } from './$types';
import { VoucherSeries } from '@prisma/client';
import { getAccountOptionsForVouchers } from '@/helpers/voucher.helpers';
import type { ExpenseClaimType, VoucherType } from '@/models/voucher.models';

export const load = (async ({ parent }) => {
	const { user, accounts } = await parent();
	const expenseClaimVoucher = defaultVoucher({
		series: VoucherSeries.B,
		expenseClaim: defaultExpenseClaim({
			name: user.fullName
		})
	}) as VoucherType & { expenseClaim: ExpenseClaimType };

	return {
		voucher: expenseClaimVoucher,
		accounts: getAccountOptionsForVouchers(accounts)
	};
}) satisfies PageLoad;
