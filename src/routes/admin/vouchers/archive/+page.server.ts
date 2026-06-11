import type { PageServerLoad } from './$types';
import { getArchivedVouchers } from '$lib/prisma';
import { formatVoucherListItems } from '@/helpers/voucher.helpers';

export const load = (async ({ url }) => {
	const oldIncluded = url.searchParams.get("old") === "true";
	const vouchers = await getArchivedVouchers(!oldIncluded);
	const voucherItems = formatVoucherListItems(vouchers);

	return {
		archivedVouchers: voucherItems.filter((v) => v.archived && !v.accounted),
		accountedVouchers: voucherItems.filter((v) => v.accounted),
		oldIncluded,
	};
}) satisfies PageServerLoad;
