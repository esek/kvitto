import { defaultInternalInvoice, defaultVoucher } from '@/constants/voucher.constants';
import type { PageLoad } from './$types';
import { VoucherSeries } from '@prisma/client';
import type { InternalInvoiceType, VoucherType } from '@/models/voucher.models';
import { getAccountOptionsForVouchers } from '@/helpers/voucher.helpers';
import { isWareAccount } from '$lib/account';

export const load = (async ({ parent }) => {
	const { accounts } = await parent();
	const internalInvoiceVoucher = defaultVoucher({
		series: VoucherSeries.B,
		internalInvoice: defaultInternalInvoice()
	}) as VoucherType & { internalInvoice: InternalInvoiceType };

	return {
		voucher: internalInvoiceVoucher,
        // storage: 1xxx, expenses: 4xxx-7xxx
		accounts: getAccountOptionsForVouchers(accounts).filter((opt) => isWareAccount(opt.value))
	};
}) satisfies PageLoad;
