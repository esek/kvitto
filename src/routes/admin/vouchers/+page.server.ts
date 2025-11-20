import { Utskott } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { getTurnedInVouchers } from '$lib/prisma';
import { formatVoucherListItems } from '@/helpers/voucher.helpers';

export const load = (async ({ url }) => {
	const utskottParam = url.searchParams.get('utskott');
	const utskott = Object.values(Utskott).includes(utskottParam as Utskott)
		? (utskottParam as Utskott)
		: undefined;

	const vouchers = await getTurnedInVouchers(utskott);

	const voucherItems = formatVoucherListItems(vouchers);
	return {
		expenseClaims: voucherItems.filter(
			(item) => !item.paid && !item.approvedBy && item.expenseClaim
		),
		expenseReports: voucherItems.filter(
			(item) => !item.paid && !item.approvedBy && item.expenseReport
		),
		internalInvoices: voucherItems.filter(
			(item) => !item.paid && !item.approvedBy && item.internalInvoice
		),
		driversExpenses: voucherItems.filter(
			(item) => !item.paid && !item.approvedBy && item.driversExpense
		),
		salesReports: voucherItems.filter((item) => !item.paid && !item.approvedBy && item.salesReport),
		accountingOrders: voucherItems.filter(
			(item) =>
				!item.paid &&
				!item.approvedBy &&
				!item.expenseClaim &&
				!item.expenseReport &&
				!item.internalInvoice &&
				!item.driversExpense &&
				!item.salesReport &&
				!item.supplierInvoice
		),
		//note that empty string is not approved, thus the _!!_
		approved: voucherItems.filter(
			(item) => (!item.paid && !!item.approvedBy) || item.supplierInvoice
		),
		paid: voucherItems.filter((item) => item.paid),
		utskott
	};
}) satisfies PageServerLoad;
