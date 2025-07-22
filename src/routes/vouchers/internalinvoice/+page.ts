import { defaultInternalInvoice, defaultVoucher } from '@/constants/voucher.constants';
import type { PageLoad } from './$types';
import { VoucherSeries } from '@prisma/client';
import type { InternalInvoiceType, VoucherType } from '@/models/voucher.models';
import { getAccountOptionsForVouchers } from '@/helpers/voucher.helpers';

export const load = (async ({ parent }) => {
	const { user, accounts } = await parent();
	const internalInvoiceVoucher = defaultVoucher({
		series: VoucherSeries.I,
		internalInvoice: defaultInternalInvoice({
			senderName: user.fullName
		})
	}) as VoucherType & { internalInvoice: InternalInvoiceType };

	return {
		voucher: internalInvoiceVoucher,
		accounts: getAccountOptionsForVouchers(accounts)
	};
}) satisfies PageLoad;
