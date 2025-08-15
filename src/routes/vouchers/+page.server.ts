import { createVoucher, getAccounts, getProfitCenters, getProjects } from '$lib/prisma';
import { formDataToJson, stringToJson, success } from '@/helpers/form.helpers.js';
import {
	type JsonFormLedReport,
	type FormLedReport,
	type FormVoucher,
	type FormVoucherWithAttachment
} from '@/models/voucher.models';
import { ledReportSchema, voucherSchema } from '@/models/zod.models';
import { fail, redirect } from '@sveltejs/kit';
import { makeLedReport, makeVoucher } from '$lib/voucher.js';
import { saveFile } from '$lib/file.js';
import { toDate } from '@/helpers/date.helpers.js';
import { formatZodErrors } from '@/helpers/zod.helpers.js';
import { sendNewVoucherEmail } from '$lib/email.js';
import { UTSKOTT_LABELS } from '@/constants/utskott.contstants.js';
import Routes from '@/constants/routes.constants';
import { CONFETTI_REDIRECT_STATUS } from '@/constants/confetti.constants.js';
import {
	defaultAccountingEntry,
	defaultSalesReport,
	defaultVoucher
} from '@/constants/voucher.constants.js';
import {
	ACCOUNT_NUMBERS,
	PROFIT_CENTER_NAMES,
	PROJECT_NUMBERS
} from '@/constants/accounting.constants.js';
import { Utskott, VoucherSeries } from '@prisma/client';

export const actions = {
	submitVoucher: async ({ request }) => {
		const formData = await request.formData();
		const formVoucherWithAttachment = formDataToJson<FormVoucherWithAttachment>(formData);
		const formVoucher = stringToJson<FormVoucher>(formVoucherWithAttachment.voucher);
		if (!formVoucher) {
			return fail(400, { errors: [{ message: 'Ogiltig verifikatdata' }] });
		}

		const newVoucher = await makeVoucher(formVoucher);
		const schema = await voucherSchema.safeParseAsync(newVoucher);
		if (schema.error) {
			return fail(400, formatZodErrors(schema.error));
		}

		const attachment = formVoucherWithAttachment.attachment;
		if (attachment && attachment.size !== 0) {
			newVoucher.attachmentUrl = await saveFile(toDate().toISOString(), attachment);
		}

		const voucher = await createVoucher(newVoucher);
		const res = await sendNewVoucherEmail(voucher.id, voucher.utskott, voucher.description);
		if (!res.success) {
			return success(
				'Skickad!',
				'Det gick dock inte att mailavisera den ansvariga, kontakta gärna utskottschefen för ' +
					UTSKOTT_LABELS[voucher.utskott] +
					' och en macapär och berätta detta.'
			);
		}
		redirect(CONFETTI_REDIRECT_STATUS, Routes.Home);
	},
	ledreport: async ({ request }) => {
		const formData = await request.formData();
		const jsonFormLedReport = formDataToJson<JsonFormLedReport>(formData);
		const formLedReport = stringToJson<FormLedReport>(jsonFormLedReport.ledreport);
		if (!formLedReport) {
			return fail(400, { errors: [{ message: 'Ogilitig veckorapportdata' }] });
		}
		const newLedReport = await makeLedReport(formLedReport);
		const schema = await ledReportSchema.safeParseAsync(newLedReport);
		if (schema.error) {
			return fail(400, formatZodErrors(schema.error));
		}

		const projects = await getProjects();
		const profitCenters = await getProfitCenters();
		const accounts = await getAccounts();

		const accounting = [
			defaultAccountingEntry({
				accountNumber: accounts.find((a) => a.number === ACCOUNT_NUMBERS.CASHLESS_PAYMENTS)?.number,
				debetInCents: newLedReport.registerTotalInCents - newLedReport.transactionFeeInCents
			}),
			defaultAccountingEntry({
				accountNumber: accounts.find((a) => a.number === ACCOUNT_NUMBERS.FOOD_REVENUE)?.number,
				kreditInCents: newLedReport.registerTotalInCents - newLedReport.patchesTotalInCents,
				profitCenterName: profitCenters.find((p) => p.name === PROFIT_CENTER_NAMES.LED_REPORTS)
					?.name
			}),
			defaultAccountingEntry({
				accountNumber: accounts.find((a) => a.number === ACCOUNT_NUMBERS.PATCHES_REVENUE)?.number,
				kreditInCents: newLedReport.patchesTotalInCents,
				profitCenterName: profitCenters.find((p) => p.name === PROFIT_CENTER_NAMES.LED_REPORTS)
					?.name
			}),
			defaultAccountingEntry({
				accountNumber: accounts.find((a) => a.number === ACCOUNT_NUMBERS.TRANSACTION_FEE)?.number,
				debetInCents: newLedReport.transactionFeeInCents,
				profitCenterName: profitCenters.find((p) => p.name === PROFIT_CENTER_NAMES.TRANSACTION_FEE)
					?.name,
				projectNumber: projects.find((p) => p.number === PROJECT_NUMBERS.TRANSACTION_FEE)?.number
			})
		].filter((a) => a.accountNumber && a.kreditInCents - a.debetInCents !== 0);

		const newVoucher = defaultVoucher({
			description: `LED-CAFÉ LÄSVECKA ${newLedReport.readingWeek} LP ${newLedReport.readingPeriod}`,
			accounting: accounting,
			series: VoucherSeries.B,
			utskott: Utskott.CM,
			label: `Veckoredovisning LED - LP${newLedReport.readingPeriod}, LV${newLedReport.readingWeek}`,
			salesReport: defaultSalesReport({
				salesFeeInCents: newLedReport.transactionFeeInCents,
				totalSalesInCents: newLedReport.registerTotalInCents - newLedReport.transactionFeeInCents
			})
		});

		const voucher = await createVoucher(newVoucher);
		redirect(CONFETTI_REDIRECT_STATUS, Routes.AdminVouchersId(voucher.id));
	}
};
