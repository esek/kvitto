import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { UTSKOTT_LABELS } from '@/constants/utskott.contstants';

export const load = (async () => {
	const prisma = new PrismaClient();

	const vouchers = await prisma.voucher.findMany({
		where: { accounted: true },
		select: {
			id: true,
			utskott: true,
			description: true
		}
	});

	const voucherItems = vouchers.map((item) => ({
		...item,
		label: UTSKOTT_LABELS[item.utskott]
	}));
	return {
		archivedVouchers: voucherItems
	};
}) satisfies PageServerLoad;
