import {
	type FormVoucher,
	type FormWare,
	type FormAccountingEntry,
	type FormAccount,
	type FormProfitCenter,
	type FormProject,
	type VoucherType,
	type WareType,
	type AccountingEntryType,
	type FormExpenseClaim,
	type ExpenseClaimType,
	type FormExpenseReport,
	type ExpenseReportType,
	type FormInternalInvoice,
	type InternalInvoiceType,
	type FormSupplierInvoice,
	type SupplierInvoiceType,
	type DriversExpenseType,
	type FormDriversExpense,
	type FormSalesReport,
	type SalesReportType,
	type FormLedReport,
	type LedReport
} from '@/models/voucher.models';
import type { Account, ProfitCenter, Project, Utskott, VoucherSeries } from '@prisma/client';
import { stringToJson } from '@/helpers/form.helpers';
import { toDate } from '@/helpers/date.helpers';
import { UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
export const makeAccount = (formAccount: FormAccount): Account => ({
	number: parseInt(formAccount.number),
	voucherLabel: formAccount.voucherLabel,
	accountingLabel: formAccount.accountingLabel
});

export const makeProfitCenter = (formProfitCenter: FormProfitCenter): ProfitCenter => ({
	name: formProfitCenter.name,
	utskott: formProfitCenter.utskott as Utskott
});

export const makeProject = (formProject: FormProject): Project => ({
	name: formProject.name,
	number: parseInt(formProject.number)
});

const makeWares = async (formUpdatedWares: FormWare[] | null): Promise<WareType[]> =>
	formUpdatedWares?.map((w) => ({
		id: w.id ?? -1,
		label: w.label,
		accountNumber: w.accountNumber ? parseInt(w.accountNumber.toString()) : null,
		unitPriceInCents: w.unitPriceInCents,
		quantity: parseInt(w.quantity.toString()),
		suggestedAccount: null,
		driversExpenseId: w.driversExpenseId,
		expenseReportId: w.expenseReportId,
		expenseClaimId: w.expenseClaimId,
		internalInvoiceId: w.internalInvoiceId,
		salesReportId: w.salesReportId
	})) ?? [];

const makeAccounting = async (
	formAccounting: FormAccountingEntry[] | null
): Promise<AccountingEntryType[]> =>
	formAccounting?.map((a) => ({
		id: a.id ?? -1,
		voucherId: a.voucherId,
		accountNumber: a.accountNumber ? parseInt(a.accountNumber.toString()) : null,
		projectNumber: a.projectNumber ? parseInt(a.projectNumber.toString()) : null,
		profitCenterName: a.profitCenterName ? a.profitCenterName : null,
		kreditInCents: a.kreditInCents,
		debetInCents: a.debetInCents,
		profitCenter: null,
		project: null,
		account: null
	})) ?? [];

const makeExpenseClaim = async (
	formExpenseClaim: FormExpenseClaim | null
): Promise<ExpenseClaimType | null> => {
	if (!formExpenseClaim) {
		return null;
	}

	const formWares = stringToJson<FormWare[]>(formExpenseClaim.wares);
	const wares = await makeWares(formWares);

	const expenseClaim: ExpenseClaimType = {
		id: formExpenseClaim.id ?? '',
		wares: wares,
		name: formExpenseClaim.name,
		ssn: formExpenseClaim.ssn,
		clearingNum: formExpenseClaim.clearingNum,
		accountNum: formExpenseClaim.accountNum,
		receiptDate: toDate(formExpenseClaim.receiptDate),
		paymentDate: formExpenseClaim.paymentDate ? toDate(formExpenseClaim.paymentDate) : null,
		paymentAddedBy: formExpenseClaim.paymentAddedBy
	};
	return expenseClaim;
};

const makeExpenseReport = async (
	formExpenseReport: FormExpenseReport | null
): Promise<ExpenseReportType | null> => {
	if (!formExpenseReport) {
		return null;
	}

	const formWares = stringToJson<FormWare[]>(formExpenseReport.wares);
	const wares = await makeWares(formWares);

	const expenseReport: ExpenseReportType = {
		id: formExpenseReport.id ?? '',
		wares: wares,
		name: formExpenseReport.name,
		receiptDate: toDate(formExpenseReport.receiptDate)
	};
	return expenseReport;
};

const makeInternalInvoice = async (
	formInternalInvoice: FormInternalInvoice | null
): Promise<InternalInvoiceType | null> => {
	if (!formInternalInvoice) {
		return null;
	}

	const formWares = stringToJson<FormWare[]>(formInternalInvoice.wares);
	const wares = await makeWares(formWares);

	const internalInvoice: InternalInvoiceType = {
		id: formInternalInvoice.id ?? '',
		wares: wares,
		senderName: formInternalInvoice.senderName ? formInternalInvoice.senderName : null,
		senderUtskott: formInternalInvoice.senderUtskott
			? (formInternalInvoice.senderUtskott as Utskott)
			: null,
		recipientName: formInternalInvoice.recipientName
	};
	return internalInvoice;
};

const makeSalesReport = async (
	formSalesReport: FormSalesReport | null
): Promise<SalesReportType | null> => {
	if (!formSalesReport) {
		return null;
	}

	const formWares = stringToJson<FormWare[]>(formSalesReport.wares);
	const wares = await makeWares(formWares);

	const salesReport: SalesReportType = {
		id: formSalesReport.id ?? '',
		salesFeeInCents: formSalesReport.salesFeeInCents
			? parseInt(formSalesReport.salesFeeInCents.toString())
			: 0,
		totalSalesInCents: formSalesReport.totalSalesInCents
			? parseInt(formSalesReport.totalSalesInCents.toString())
			: 0,
		projectNumber: formSalesReport.projectNumber
			? parseInt(formSalesReport.projectNumber.toString())
			: null,
		wares: wares
	};
	return salesReport;
};

const makeSupplierInvoice = async (
	formSupplierInvoice: FormSupplierInvoice | null
): Promise<SupplierInvoiceType | null> => {
	if (!formSupplierInvoice) {
		return null;
	}

	const supplierInvoice: SupplierInvoiceType = {
		id: formSupplierInvoice.id ?? '',
		invoiceNumber: formSupplierInvoice.invoiceNumber,
		ocr: formSupplierInvoice.ocr,
		dueDate: toDate(formSupplierInvoice.dueDate),
		companyName: formSupplierInvoice.companyName,
		companyNumber: formSupplierInvoice.companyNumber ? formSupplierInvoice.companyNumber : null
	};
	return supplierInvoice;
};

const makeDriversExpense = async (
	formDriversExpense: FormDriversExpense | null
): Promise<DriversExpenseType | null> => {
	if (!formDriversExpense) {
		return null;
	}

	const driversExpense: DriversExpenseType = {
		id: formDriversExpense.id ?? '',
		name: formDriversExpense.name,
		ssn: formDriversExpense.ssn,
		destination: formDriversExpense.destination,
		clearingNum: formDriversExpense.clearingNum,
		accountNum: formDriversExpense.accountNum,
		paymentDate: formDriversExpense.paymentDate ? toDate(formDriversExpense.paymentDate) : null,
		paymentAddedBy: formDriversExpense.paymentAddedBy,
		miles: formDriversExpense.miles ? parseInt(formDriversExpense.miles.toString()) : 0,
		ticketPriceInCents: formDriversExpense.ticketPriceInCents
			? parseInt(formDriversExpense.ticketPriceInCents.toString())
			: 0,
		milesCompensationInCents: formDriversExpense.milesCompensationInCents
			? parseInt(formDriversExpense.milesCompensationInCents.toString())
			: 0
	};
	return driversExpense;
};

export const makeVoucher = async (formVoucher: FormVoucher): Promise<VoucherType> => {
	const formAccounting = stringToJson<FormAccountingEntry[]>(formVoucher.accounting);
	const formExpenseClaim = stringToJson<FormExpenseClaim>(formVoucher.expenseClaim);
	const formExpenseReport = stringToJson<FormExpenseReport>(formVoucher.expenseReport);
	const formInternalInvoice = stringToJson<FormInternalInvoice>(formVoucher.internalInvoice);
	const formSalesReport = stringToJson<FormSalesReport>(formVoucher.salesReport);
	const formSupplierInvoice = stringToJson<FormSupplierInvoice>(formVoucher.supplierInvoice);
	const formDriversExpense = stringToJson<FormDriversExpense>(formVoucher.driversExpense);

	const accounting = await makeAccounting(formAccounting);
	const expenseClaim = await makeExpenseClaim(formExpenseClaim);
	const expenseReport = await makeExpenseReport(formExpenseReport);
	const internalInvoice = await makeInternalInvoice(formInternalInvoice);
	const salesReport = await makeSalesReport(formSalesReport);
	const supplierInvoice = await makeSupplierInvoice(formSupplierInvoice);
	const driversExpense = await makeDriversExpense(formDriversExpense);

	const utskott =
		UTSKOTT_OPTIONS.find((u) => u.label.toLowerCase() == formVoucher.utskott?.toLowerCase())
			?.value ?? formVoucher.utskott;
	const newVoucher: VoucherType = {
		id: formVoucher.id ?? '',
		transactionDate: formVoucher.transactionDate ? toDate(formVoucher.transactionDate) : null,
		dateTurnedIn: toDate(),
		description: formVoucher.description,
		accounting: accounting,
		series: formVoucher.series as VoucherSeries,
		label: formVoucher.label ?? null,
		accountedBy: formVoucher.accountedBy ?? null,
		approvedBy: formVoucher.approvedBy ?? null,
		approvedAt: formVoucher.approvedAt ? toDate(formVoucher.approvedAt) : null,
		attachmentUrl: formVoucher.attachmentUrl ?? null,
		reference: formVoucher.reference ?? null,
		referenceEmail: formVoucher.referenceEmail ?? null,
		comment: formVoucher.comment ?? null,
		utskott: utskott as Utskott,
		expenseClaim: expenseClaim,
		expenseReport: expenseReport,
		internalInvoice: internalInvoice,
		salesReport: salesReport,
		supplierInvoice: supplierInvoice,
		driversExpense: driversExpense,
		accounted: formVoucher.accounted ?? false,
		paid: formVoucher.paid ?? false,
		archived: formVoucher.archived ?? false
	};
	return newVoucher;
};

export const makeLedReport = async (formLedReport: FormLedReport): Promise<LedReport> => ({
	readingPeriod: Number(formLedReport.readingPeriod),
	readingWeek: Number(formLedReport.readingWeek),
	registerTotalInCents: formLedReport.registerTotalInCents,
	transactionFeeInCents: formLedReport.transactionFeeInCents,
	patchesTotalInCents: formLedReport.patchesTotalInCents,
	foodTotalInCents: formLedReport.registerTotalInCents - formLedReport.patchesTotalInCents,
	comment: formLedReport.comment
});
