import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { UTSKOTT_LABELS } from '@/constants/utskott.contstants';

export const load = (async () => {
	const prisma = new PrismaClient();

	const vouchers = await prisma.voucher.findMany({
		where: { OR: [{ accounted: true }, { archived: true }] },
		select: {
			id: true,
			utskott: true,
			description: true,
			accounted: true,
			archived: true
		}
	});

	const voucherItems = vouchers.map((item) => ({
		...item,
		label: UTSKOTT_LABELS[item.utskott]
	}));
	return {
		archivedVouchers: voucherItems.filter((v) => v.archived && !v.accounted),
		accountedVouchers: voucherItems.filter((v) => v.accounted)
	};
}) satisfies PageServerLoad;
