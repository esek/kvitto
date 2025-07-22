import { defaultVoucher } from '@/constants/voucher.constants';
import type { PageLoad } from './$types';
import { VoucherSeries } from '@prisma/client';
export const load = (async () => {
	const voucher = defaultVoucher({
		series: VoucherSeries.B
	});

	return {
		voucher: voucher
	};
}) satisfies PageLoad;
