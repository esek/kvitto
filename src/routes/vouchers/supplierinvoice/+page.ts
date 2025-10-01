import { defaultSupplierInvoice, defaultVoucher } from '@/constants/voucher.constants';
import type { PageLoad } from './$types';
import { Utskott, VoucherSeries } from '@prisma/client';
import type { SupplierInvoiceType, VoucherType } from '@/models/voucher.models';

export const load = (async ({ data }) => {
	const supplierInvoiceVoucher = defaultVoucher({
		series: VoucherSeries.L,
		supplierInvoice: defaultSupplierInvoice({}),
		label: 'Leverantörsfaktura',
		utskott: Utskott.PENGU
	}) as VoucherType & { supplierInvoice: SupplierInvoiceType };

	return {
		voucher: supplierInvoiceVoucher,
		suppliers: data.suppliers
	};
}) satisfies PageLoad;
