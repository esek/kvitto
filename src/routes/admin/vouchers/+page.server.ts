import { PrismaClient, Utskott } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { UTSKOTT_LABELS } from '@/constants/utskott.contstants';

export const load = (async ({ url }) => {
	const prisma = new PrismaClient();
	const utskottParam = url.searchParams.get('utskott');
	const utskott = Object.values(Utskott).includes(utskottParam as Utskott)
		? (utskottParam as Utskott)
		: undefined;

	const vouchers = await prisma.voucher.findMany({
		where: { utskott, accounted: false },
		select: {
			id: true,
			utskott: true,
			description: true,
			approvedBy: true,
			expenseClaim: { select: { id: true } },
			expenseReport: { select: { id: true } },
			internalInvoice: { select: { id: true } },
			salesReport: { select: { id: true } },
			driversExpense: { select: { id: true } },
			supplierInvoice: { select: { id: true } }
		}
	});

	const voucherItems = vouchers.map((item) => ({
		...item,
		label: UTSKOTT_LABELS[item.utskott]
	}));
	return {
		expenseClaims: voucherItems.filter((item) => !item.approvedBy && item.expenseClaim),
		expenseReports: voucherItems.filter((item) => !item.approvedBy && item.expenseReport),
		internalInvoices: voucherItems.filter((item) => !item.approvedBy && item.internalInvoice),
		driversExpenses: voucherItems.filter((item) => !item.approvedBy && item.driversExpense),
		salesReports: voucherItems.filter((item) => !item.approvedBy && item.salesReport),
		accountingOrders: voucherItems.filter(
			(item) =>
				!item.approvedBy &&
				!item.expenseClaim &&
				!item.expenseReport &&
				!item.internalInvoice &&
				!item.driversExpense &&
				!item.salesReport &&
				!item.supplierInvoice
		),
		//note that empty string is not approved, thus the _!!_
		approved: voucherItems.filter((item) => !!item.approvedBy || item.supplierInvoice),

		utskott
	};
}) satisfies PageServerLoad;
