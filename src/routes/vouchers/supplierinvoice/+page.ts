import { defaultSupplierInvoice, defaultVoucher } from '@/constants/voucher.constants';
import type { PageLoad } from './$types';
import { Utskott, VoucherSeries } from '@prisma/client';
import type { SupplierInvoiceType, VoucherType } from '@/models/voucher.models';

export const load = (async () => {
	const supplierInvoiceVoucher = defaultVoucher({
		series: VoucherSeries.L,
		supplierInvoice: defaultSupplierInvoice({}),
		utskott: Utskott.PENGU
	}) as VoucherType & { supplierInvoice: SupplierInvoiceType };

	return {
		voucher: supplierInvoiceVoucher
	};
}) satisfies PageLoad;
