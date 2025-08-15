import { getFortnoxApiClient } from '$lib/fortnox';
import { getVoucher } from '$lib/prisma';
import type { RequestHandler } from './$types';
import { manageError } from '@/helpers/fortnox.helpers';
export const POST: RequestHandler = async ({ fetch, params }) => {
	const { id } = params;
	const voucher = await getVoucher(id);
	if (!voucher) {
		return new Response('Verifikat existerar inte', { status: 400 });
	}

	if (!voucher.transactionDate || isNaN(new Date(voucher.transactionDate).getTime())) {
		return new Response('Saknar transaktionsdatum', { status: 400 });
	}

	if (!voucher.label) {
		return new Response('Saknar etikett', { status: 400 });
	}

	const accounting = voucher.accounting;

	if (!accounting?.length) {
		return new Response('Ingen kontering på verifikat', { status: 400 });
	}

	if (accounting.length === 1) {
		return new Response('Kontering kan inte vara en rad lång', { status: 400 });
	}

	const fortnoxAccounting = accounting.map((a) => ({
		Account: a.account?.number ?? -1,
		CostCenter: a.profitCenter?.name,
		Credit: a.kreditInCents / 100,
		Debit: a.debetInCents / 100,
		Project: a.project?.number?.toString()
	}));

	if (fortnoxAccounting.some((a) => a.Account === -1)) {
		return new Response('Varje rad i konteringen måste specificera ett kontonummer', {
			status: 400
		});
	}

	let balance = 0;
	fortnoxAccounting.forEach((a) => (balance += a.Debit - a.Credit));
	if (balance != 0) {
		return new Response('Kontering måste vara balanserad', { status: 400 });
	}

	const fortnoxApi = getFortnoxApiClient(fetch);

	const si = voucher.supplierInvoice;
	if (si) {
		if (!si.companyNumber) {
			return new Response('Leverantörsnummer saknas', { status: 400 });
		}
		let total = 0;
		accounting.forEach((a) => (total += a.kreditInCents));
		const { data, error } = await fortnoxApi.POST('/3/supplierinvoices', {
			body: {
				SupplierInvoice: {
					SupplierNumber: si.companyNumber,
					SupplierInvoiceRows: [
						{
							Account: 2440,
							Credit: total / 100
						}
					],
					Total: (total / 100).toString(),
					SupplierName: si.companyName,
					OCR: si.ocr,
					InvoiceNumber: si.invoiceNumber,
					DueDate: si.dueDate.toISOString().slice(0, 10)
				}
			}
		});
		if (!data || error) {
			return manageError(error);
		}
	}

	const { data, error } = await fortnoxApi.POST('/3/vouchers', {
		body: {
			Voucher: {
				Description: voucher.label.slice(0, 200),
				TransactionDate: voucher.transactionDate.toISOString().slice(0, 10),
				VoucherSeries: voucher.series,
				VoucherRows: fortnoxAccounting
			}
		}
	});

	if (!data || error) {
		return manageError(error);
	}
	return new Response('Voucher created!', { status: 200 });
};
