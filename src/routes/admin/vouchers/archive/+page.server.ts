import type { PageServerLoad } from './$types';
import { getArchivedVouchers } from '$lib/prisma';
import { formatVoucherListItems } from '@/helpers/voucher.helpers';

export const load = (async () => {
	const vouchers = await getArchivedVouchers();
	const voucherItems = formatVoucherListItems(vouchers);

	return {
		archivedVouchers: voucherItems.filter((v) => v.archived && !v.accounted),
		accountedVouchers: voucherItems.filter((v) => v.accounted)
	};
}) satisfies PageServerLoad;
