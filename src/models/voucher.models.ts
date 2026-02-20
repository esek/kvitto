import {
	Prisma,
	type Account,
	type AccountingEntry,
	type DriversExpense,
	type ExpenseClaim,
	type ExpenseReport,
	type InternalInvoice,
	type ProfitCenter,
	type Project,
	type SalesReport,
	type SupplierInvoice,
	type Voucher,
	type Ware
} from '@prisma/client';

type FormFields<A, B extends Record<keyof A, unknown>> = B;

type Select<A, K extends keyof A> = Pick<Record<keyof A, true>, K>;

type FormEnum<T, Prefix extends string = ''> = Record<
	Uppercase<Extract<keyof T, string>>,
	`${Prefix}${Extract<keyof T, string>}`
>;
type JsonString<T> = string & { readonly __jsonType__: T };

/*
 *
 *	"Form" for FormData to Json and form input bindings
 *	StringifiedJson is used to signify that the incoming string is
 * 	supposed to be parsed as a json object
 *
 *  Every type of voucher will have its own Form type, which is used to
 *  specify the necessary fields used to create a full voucher.
 */

export type FormProject = FormFields<
	Project,
	{
		number: string;
		name: string;
	}
>;
export type JsonFormProject = { project: JsonString<FormProject> };
export const FormProjectNames: FormEnum<FormProject> = {
	NAME: 'name',
	NUMBER: 'number'
};

export type FormProfitCenter = FormFields<
	ProfitCenter,
	{
		name: string;
		utskott: string;
	}
>;
export type JsonFormProfitCenter = { profitCenter: JsonString<FormProfitCenter> };
export const FormProfitCenterNames: FormEnum<FormProfitCenter> = {
	NAME: 'name',
	UTSKOTT: 'utskott'
};

export type FormAccount = FormFields<
	Account,
	{
		number: string;
		voucherLabel: string;
		accountingLabel: string;
	}
>;
export type JsonFormAccount = { account: JsonString<FormAccount> };

export const FormAccountNames: FormEnum<FormAccount> = {
	NUMBER: 'number',
	VOUCHERLABEL: 'voucherLabel',
	ACCOUNTINGLABEL: 'accountingLabel'
};

export type FormWare = FormFields<
	Ware,
	{
		id: number | null;
		label: string;
		quantity: number;
		accountNumber: number | null;
		unitPriceInCents: number;
		expenseReportId: string | null;
		expenseClaimId: string | null;
		internalInvoiceId: string | null;
		salesReportId: string | null;
		driversExpenseId: string | null;
	}
>;
export const FormWareNames: FormEnum<FormWare> = {
	ID: 'id',
	LABEL: 'label',
	ACCOUNTNUMBER: 'accountNumber',
	QUANTITY: 'quantity',
	UNITPRICEINCENTS: 'unitPriceInCents',
	EXPENSEREPORTID: 'expenseReportId',
	EXPENSECLAIMID: 'expenseClaimId',
	INTERNALINVOICEID: 'internalInvoiceId',
	SALESREPORTID: 'salesReportId',
	DRIVERSEXPENSEID: 'driversExpenseId'
};

export type FormAccountingEntry = FormFields<
	AccountingEntry,
	{
		id: number | null;
		profitCenterName: string;
		projectNumber: number;
		debetInCents: number;
		kreditInCents: number;
		accountNumber: number;
		voucherId: string | null;
	}
>;
export const FormAccountingEntryNames: FormEnum<FormAccountingEntry> = {
	ID: 'id',
	PROFITCENTERNAME: 'profitCenterName',
	PROJECTNUMBER: 'projectNumber',
	DEBETINCENTS: 'debetInCents',
	KREDITINCENTS: 'kreditInCents',
	ACCOUNTNUMBER: 'accountNumber',
	VOUCHERID: 'voucherId'
};

export type FormVoucher = FormFields<
	Voucher,
	{
		id: string | null;
		description: string;
		series: string | null;
		label: string | null;
		attachmentUrl: string | null;
		approvedBy: string | null;
		approvedAt: string | null;
		accountedBy: string | null;
		dateTurnedIn: string | null;
		transactionDate: string | null;
		comment: string | null;
		reference: string | null;
		utskott: string | null;
		accounting: JsonString<FormAccountingEntry[]> | null;
		expenseClaim: JsonString<FormExpenseClaim> | null;
		expenseReport: JsonString<FormExpenseReport> | null;
		internalInvoice: JsonString<FormInternalInvoice> | null;
		supplierInvoice: JsonString<FormSupplierInvoice> | null;
		salesReport: JsonString<FormSalesReport> | null;
		driversExpense: JsonString<FormDriversExpense> | null;
		accounted: boolean | null;
		paid: boolean | null;
		archived: boolean | null;
		referenceEmail: string | null;
	}
>;

//Top form model for all vouchers
export type FormVoucherWithAttachment = {
	voucher: JsonString<FormVoucher>;
	attachment: File | null;
};
export const FormVoucherWithAttachmentNames: FormEnum<FormVoucherWithAttachment> = {
	VOUCHER: 'voucher',
	ATTACHMENT: 'attachment'
};

export const FormVoucherNames: FormEnum<FormVoucher> = {
	ID: 'id',
	DESCRIPTION: 'description',
	SERIES: 'series',
	LABEL: 'label',
	ATTACHMENTURL: 'attachmentUrl',
	APPROVEDBY: 'approvedBy',
	APPROVEDAT: 'approvedAt',
	ACCOUNTEDBY: 'accountedBy',
	DATETURNEDIN: 'dateTurnedIn',
	TRANSACTIONDATE: 'transactionDate',
	ACCOUNTING: 'accounting',
	EXPENSECLAIM: 'expenseClaim',
	EXPENSEREPORT: 'expenseReport',
	INTERNALINVOICE: 'internalInvoice',
	SALESREPORT: 'salesReport',
	SUPPLIERINVOICE: 'supplierInvoice',
	DRIVERSEXPENSE: 'driversExpense',
	COMMENT: 'comment',
	REFERENCE: 'reference',
	UTSKOTT: 'utskott',
	ACCOUNTED: 'accounted',
	PAID: 'paid',
	ARCHIVED: 'archived',
	REFERENCEEMAIL: 'referenceEmail'
};

export type FormExpenseClaim = FormFields<
	ExpenseClaim,
	{
		id: string | null;
		name: string;
		ssn: string;
		clearingNum: string;
		accountNum: string;
		receiptDate: string;
		wares: JsonString<FormWare[]> | null;
		paymentDate: string | null;
		paymentAddedBy: string | null;
	}
>;

export const FormExpenseClaimNames: FormEnum<
	FormExpenseClaim,
	typeof FormVoucherNames.EXPENSECLAIM
> = {
	ID: 'expenseClaimid',
	NAME: 'expenseClaimname',
	SSN: 'expenseClaimssn',
	CLEARINGNUM: 'expenseClaimclearingNum',
	ACCOUNTNUM: 'expenseClaimaccountNum',
	RECEIPTDATE: 'expenseClaimreceiptDate',
	WARES: 'expenseClaimwares',
	PAYMENTDATE: 'expenseClaimpaymentDate',
	PAYMENTADDEDBY: 'expenseClaimpaymentAddedBy'
};

export type FormExpenseReport = FormFields<
	ExpenseReport,
	{
		id: string | null;
		name: string;
		receiptDate: string;
		wares: JsonString<FormWare[]> | null;
	}
>;

export const FormExpenseReportNames: FormEnum<
	FormExpenseReport,
	typeof FormVoucherNames.EXPENSEREPORT
> = {
	ID: 'expenseReportid',
	NAME: 'expenseReportname',
	RECEIPTDATE: 'expenseReportreceiptDate',
	WARES: 'expenseReportwares'
};

export type FormInternalInvoice = FormFields<
	InternalInvoice,
	{
		id: string | null;
		description: string;
		senderName: string;
		senderUtskott: string;
		recipientName: string;
		wares: JsonString<FormWare[]> | null;
	}
>;

export const FormInternalInvoiceNames: FormEnum<
	FormInternalInvoice,
	typeof FormVoucherNames.INTERNALINVOICE
> = {
	ID: 'internalInvoiceid',
	DESCRIPTION: 'internalInvoicedescription',
	SENDERNAME: 'internalInvoicesenderName',
	SENDERUTSKOTT: 'internalInvoicesenderUtskott',
	RECIPIENTNAME: 'internalInvoicerecipientName',
	WARES: 'internalInvoicewares'
};

export type FormSalesReport = FormFields<
	SalesReport,
	{
		id: string | null;
		salesFeeInCents: number;
		totalSalesInCents: number;
		projectNumber: number | null;
		wares: JsonString<FormWare[]> | null;
	}
>;

export const FormSalesReportNames: FormEnum<FormSalesReport, typeof FormVoucherNames.SALESREPORT> =
	{
		ID: 'salesReportid',
		SALESFEEINCENTS: 'salesReportsalesFeeInCents',
		TOTALSALESINCENTS: 'salesReporttotalSalesInCents',
		PROJECTNUMBER: 'salesReportprojectNumber',
		WARES: 'salesReportwares'
	};

export type FormSupplierInvoice = FormFields<
	SupplierInvoice,
	{
		id: string | null;
		invoiceNumber: string;
		ocr: string;
		dueDate: string;
		companyName: string;
		companyNumber: string;
	}
>;

export const FormSupplierInvoiceNames: FormEnum<
	FormSupplierInvoice,
	typeof FormVoucherNames.SUPPLIERINVOICE
> = {
	ID: 'supplierInvoiceid',
	INVOICENUMBER: 'supplierInvoiceinvoiceNumber',
	OCR: 'supplierInvoiceocr',
	DUEDATE: 'supplierInvoicedueDate',
	COMPANYNAME: 'supplierInvoicecompanyName',
	COMPANYNUMBER: 'supplierInvoicecompanyNumber'
};

export type FormDriversExpense = FormFields<
	DriversExpense,
	{
		id: string | null;
		name: string;
		ssn: string;
		destination: string;
		clearingNum: string;
		accountNum: string;
		paymentDate: string | null;
		paymentAddedBy: string | null;
		miles: number;
		milesCompensationInCents: number;
		ticketPriceInCents: number;
	}
>;

export const FormDriversExpenseNames: FormEnum<
	FormDriversExpense,
	typeof FormVoucherNames.DRIVERSEXPENSE
> = {
	ID: 'driversExpenseid',
	NAME: 'driversExpensename',
	SSN: 'driversExpensessn',
	DESTINATION: 'driversExpensedestination',
	CLEARINGNUM: 'driversExpenseclearingNum',
	ACCOUNTNUM: 'driversExpenseaccountNum',
	PAYMENTDATE: 'driversExpensepaymentDate',
	PAYMENTADDEDBY: 'driversExpensepaymentAddedBy',
	MILES: 'driversExpensemiles',
	TICKETPRICEINCENTS: 'driversExpenseticketPriceInCents',
	MILESCOMPENSATIONINCENTS: 'driversExpensemilesCompensationInCents'
};

export type FormLedReport = {
	readingPeriod: string;
	readingWeek: string;
	registerTotalInCents: number;
	transactionFeeInCents: number;
	patchesTotalInCents: number;
	foodTotalInCents: number;
	comment: string;
	transactionDate: Date | null;
	attachment: File | null;
};
export type JsonFormLedReport = { ledreport: JsonString<FormLedReport>; attachment: File | null };
export const FormLedReportNames: FormEnum<FormLedReport> = {
	READINGPERIOD: 'readingPeriod',
	READINGWEEK: 'readingWeek',
	REGISTERTOTALINCENTS: 'registerTotalInCents',
	TRANSACTIONFEEINCENTS: 'transactionFeeInCents',
	PATCHESTOTALINCENTS: 'patchesTotalInCents',
	FOODTOTALINCENTS: 'foodTotalInCents',
	COMMENT: 'comment',
	TRANSACTIONDATE: 'transactionDate',
	ATTACHMENT: 'attachment'
};

export type LedReport = FormFields<
	FormLedReport,
	{
		readingPeriod: number;
		readingWeek: number;
		registerTotalInCents: number;
		transactionFeeInCents: number;
		patchesTotalInCents: number;
		foodTotalInCents: number;
		comment: string;
		transactionDate: Date;
		attachment: File | null;
	}
>;

/*
 *
 *	"New" for types used when creating DB entries
 *
 */
// Misc.
type NewAccountSelection = Select<Account, 'number' | 'accountingLabel' | 'voucherLabel'>;
export type NewAccount = Prisma.AccountGetPayload<{
	select: NewAccountSelection;
}>;

type NewProfitCenterSelection = Select<ProfitCenter, 'name' | 'utskott'>;
export type NewProfitCenter = Prisma.ProfitCenterGetPayload<{
	select: NewProfitCenterSelection;
}>;

type NewProjectSelection = Select<Project, 'name' | 'number'>;
export type NewProject = Prisma.ProjectGetPayload<{
	select: NewProjectSelection;
}>;

// New Vouchers
type NewWareSelection = Select<Ware, 'label' | 'accountNumber' | 'quantity' | 'unitPriceInCents'>;
export type NewWare = Prisma.WareGetPayload<{
	select: NewWareSelection;
}>;

type NewAccountingEntrySelection = Select<
	AccountingEntry,
	'debetInCents' | 'kreditInCents' | 'projectNumber' | 'profitCenterName' | 'accountNumber'
>;
export type NewAccountingEntry = Prisma.AccountingEntryGetPayload<{
	select: NewAccountingEntrySelection;
}>;

type NewExperseClaimSelection = Select<
	ExpenseClaim,
	'accountNum' | 'clearingNum' | 'ssn' | 'receiptDate' | 'name'
>;
export type NewExpenseClaim = Prisma.ExpenseClaimGetPayload<{
	select: NewExperseClaimSelection & {
		wares: { select: NewWareSelection };
	};
}>;

type NewExpenseReportSelection = Select<ExpenseReport, 'name' | 'receiptDate'>;
export type NewExpenseReport = Prisma.ExpenseReportGetPayload<{
	select: NewExpenseReportSelection & {
		wares: { select: NewWareSelection };
	};
}>;

type NewInternalInvoiceSelection = Select<
	InternalInvoice,
	'senderName' | 'senderUtskott' | 'recipientName'
>;
export type NewInternalInvoice = Prisma.InternalInvoiceGetPayload<{
	select: NewInternalInvoiceSelection & {
		wares: { select: NewWareSelection };
	};
}>;

type NewSalesReportSelection = Select<
	SalesReport,
	'projectNumber' | 'salesFeeInCents' | 'totalSalesInCents'
>;
export type NewSalesReport = Prisma.SalesReportGetPayload<{
	select: NewSalesReportSelection & {
		wares: { select: NewWareSelection };
	};
}>;

type NewSupplierInvoiceSelection = Select<
	SupplierInvoice,
	'invoiceNumber' | 'ocr' | 'dueDate' | 'companyName' | 'companyNumber'
>;
export type NewSupplierInvoice = Prisma.SupplierInvoiceGetPayload<{
	select: NewSupplierInvoiceSelection;
}>;

type NewDriversExpenseSelection = Select<
	DriversExpense,
	'destination' | 'ssn' | 'name' | 'clearingNum' | 'accountNum' | 'miles' | 'ticketPriceInCents'
>;
export type NewDriversExpense = Prisma.DriversExpenseGetPayload<{
	select: NewDriversExpenseSelection;
}>;

type NewVoucherSelection = Select<
	Voucher,
	| 'description'
	| 'series'
	| 'attachmentUrl'
	| 'comment'
	| 'utskott'
	| 'reference'
	| 'label'
	| 'referenceEmail'
	| 'transactionDate'
>;
export type NewVoucher = Prisma.VoucherGetPayload<{
	select: NewVoucherSelection & {
		expenseClaim: { select: NewExperseClaimSelection & { wares: { select: NewWareSelection } } };
		expenseReport: { select: NewExpenseReportSelection & { wares: { select: NewWareSelection } } };
		internalInvoice: {
			select: NewInternalInvoiceSelection & { wares: { select: NewWareSelection } };
		};
		salesReport: { select: NewSalesReportSelection & { wares: { select: NewWareSelection } } };
		supplierInvoice: { select: NewSupplierInvoiceSelection };
		driversExpense: { select: NewDriversExpenseSelection };
		accounting: { select: NewAccountingEntrySelection };
	};
}>;

/*
 *
 *	"Updated" for types used when updating DB entries
 *
 */
type UpdatedAccountSelection = Select<Account, 'number' | 'voucherLabel'>;
export type UpdatedAccount = Prisma.AccountGetPayload<{
	select: UpdatedAccountSelection;
}>;
type UpdatedProjectSelection = Select<Project, 'name' | 'number'>;
export type UpdatedProject = Prisma.ProjectGetPayload<{
	select: UpdatedProjectSelection;
}>;
type UpdateProfitCenterSelection = Select<ProfitCenter, 'utskott' | 'name'>;
export type UpdatedProfitCenter = Prisma.ProfitCenterGetPayload<{
	select: UpdateProfitCenterSelection;
}>;

type UpdatedExpenseClaimSelection = Select<
	ExpenseClaim,
	| 'id'
	| 'name'
	| 'ssn'
	| 'clearingNum'
	| 'accountNum'
	| 'receiptDate'
	| 'paymentDate'
	| 'paymentAddedBy'
>;
export type UpdatedExpenseClaim = Prisma.ExpenseClaimGetPayload<{
	select: UpdatedExpenseClaimSelection & {
		wares: {
			select: NewWareSelection; //we don't update wares, we delete and create new ones
		};
	};
}>;

type UpdatedExpenseReportSelection = Select<ExpenseReport, 'id' | 'name' | 'receiptDate'>;
export type UpdatedExpenseReport = Prisma.ExpenseReportGetPayload<{
	select: UpdatedExpenseReportSelection & {
		wares: {
			select: NewWareSelection;
		};
	};
}>;

type UpdatedInternalInvoiceSelection = Select<
	InternalInvoice,
	'id' | 'senderName' | 'senderUtskott' | 'recipientName'
>;
export type UpdatedInternalInvoice = Prisma.InternalInvoiceGetPayload<{
	select: UpdatedInternalInvoiceSelection & {
		wares: {
			select: NewWareSelection;
		};
	};
}>;

type UpdatedSalesReportSelection = Select<
	SalesReport,
	'id' | 'projectNumber' | 'salesFeeInCents' | 'totalSalesInCents'
>;
export type UpdatedSalesReport = Prisma.SalesReportGetPayload<{
	select: UpdatedSalesReportSelection & {
		wares: { select: NewWareSelection };
	};
}>;

type UpdatedSupplierInvoiceSelection = Select<
	SupplierInvoice,
	'id' | 'invoiceNumber' | 'ocr' | 'dueDate' | 'companyName' | 'companyNumber'
>;
export type UpdatedSupplierInvoice = Prisma.SupplierInvoiceGetPayload<{
	select: UpdatedSupplierInvoiceSelection;
}>;

type UpdatedDriversExpenseSelection = Select<
	DriversExpense,
	| 'id'
	| 'destination'
	| 'ssn'
	| 'name'
	| 'clearingNum'
	| 'accountNum'
	| 'miles'
	| 'ticketPriceInCents'
	| 'paymentDate'
	| 'paymentAddedBy'
	| 'milesCompensationInCents'
>;
export type UpdatedDriversExpense = Prisma.DriversExpenseGetPayload<{
	select: UpdatedDriversExpenseSelection;
}>;

type UpdatedVoucherSelection = Select<
	Voucher,
	| 'id'
	| 'description'
	| 'transactionDate'
	| 'label'
	| 'series'
	| 'accountedBy'
	| 'approvedBy'
	| 'approvedAt'
	| 'comment'
	| 'utskott'
	| 'reference'
	| 'paid'
	| 'archived'
	| 'accounted'
>;
export type UpdatedVoucher = Prisma.VoucherGetPayload<{
	select: UpdatedVoucherSelection & {
		expenseClaim: {
			select: UpdatedExpenseClaimSelection & {
				wares: {
					select: NewWareSelection;
				};
			};
		};
		expenseReport: {
			select: UpdatedExpenseReportSelection & {
				wares: {
					select: NewWareSelection;
				};
			};
		};
		internalInvoice: {
			select: UpdatedInternalInvoiceSelection & {
				wares: {
					select: NewWareSelection;
				};
			};
		};
		salesReport: {
			select: UpdatedSalesReportSelection & {
				wares: {
					select: NewWareSelection;
				};
			};
		};
		supplierInvoice: {
			select: UpdatedSupplierInvoiceSelection;
		};
		driversExpense: {
			select: UpdatedDriversExpenseSelection;
		};
		accounting: {
			select: NewAccountingEntrySelection;
		};
	};
}>;

/*
 *
 *	"Type" for models with commonly added include fields
 *
 */
export type ExpenseClaimType = Prisma.ExpenseClaimGetPayload<{
	include: {
		wares: {
			include: { suggestedAccount: true };
		};
	};
}>;
export type ExpenseReportType = Prisma.ExpenseReportGetPayload<{
	include: {
		wares: {
			include: { suggestedAccount: true };
		};
	};
}>;
export type InternalInvoiceType = Prisma.InternalInvoiceGetPayload<{
	include: {
		wares: {
			include: { suggestedAccount: true };
		};
	};
}>;
export type SalesReportType = Prisma.SalesReportGetPayload<{
	include: {
		wares: {
			include: { suggestedAccount: true };
		};
	};
}>;
export type SupplierInvoiceType = Prisma.SupplierInvoiceGetPayload<{}>;
export type DriversExpenseType = Prisma.DriversExpenseGetPayload<{}>;
export type VoucherType = Prisma.VoucherGetPayload<{
	include: {
		accounting: { include: { profitCenter: true; account: true; project: true } };
		expenseClaim: {
			include: {
				wares: {
					include: { suggestedAccount: true };
				};
			};
		};
		expenseReport: {
			include: {
				wares: {
					include: { suggestedAccount: true };
				};
			};
		};
		internalInvoice: {
			include: {
				wares: {
					include: { suggestedAccount: true };
				};
			};
		};
		salesReport: {
			include: {
				wares: {
					include: { suggestedAccount: true };
				};
			};
		};
		supplierInvoice: true;
		driversExpense: true;
	};
}>;
export type VoucherFortnoxType = Prisma.VoucherFortnoxIdentifierGetPayload<{}>;
export type AccountingEntryType = Prisma.AccountingEntryGetPayload<{
	include: { profitCenter: true; project: true; account: true };
}>;
export type WareType = Prisma.WareGetPayload<{
	include: { suggestedAccount: true };
}>;
