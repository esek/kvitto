import { toDate } from '@/helpers/date.helpers';
import type { IOption } from '@/models/form.models';
import type {
	AccountingEntryType,
	DriversExpenseType,
	ExpenseClaimType,
	ExpenseReportType,
	InternalInvoiceType,
	SalesReportType,
	SupplierInvoiceType,
	VoucherType,
	WareType
} from '@/models/voucher.models';
import { Utskott, VoucherSeries } from '@prisma/client';

export const SERIES_OPTIONS: IOption[] = [
	{
		label: 'B',
		value: VoucherSeries.B
	},
	{
		label: 'I',
		value: VoucherSeries.I
	},
	{
		label: 'K',
		value: VoucherSeries.K
	},
	{
		label: 'L',
		value: VoucherSeries.L
	},
	{
		label: 'U',
		value: VoucherSeries.U
	}
];

export const defaultWare = (props: Partial<WareType> = {}): WareType => ({
	id: -1,
	label: '',
	suggestedAccount: null,
	accountNumber: null,
	unitPriceInCents: 0,
	quantity: 1,
	expenseReportId: null,
	expenseClaimId: null,
	internalInvoiceId: null,
	salesReportId: null,
	...props
});

export const defaultAccountingEntry = (
	props: Partial<AccountingEntryType> = {}
): AccountingEntryType => ({
	id: -1,
	account: null,
	accountNumber: null,
	profitCenter: null,
	profitCenterName: '',
	projectNumber: 0,
	project: null,
	debetInCents: 0,
	kreditInCents: 0,
	voucherId: '',
	...props
});

export const defaultVoucher = (props: Partial<VoucherType> = {}): VoucherType => ({
	id: '',
	label: null,
	attachmentUrl: null,
	series: VoucherSeries.B,
	approvedBy: null,
	accountedBy: null,
	accounting: [],
	transactionDate: null,
	dateTurnedIn: toDate(),
	description: '',
	comment: null,
	reference: null,
	utskott: '' as Utskott,
	expenseClaim: null,
	expenseReport: null,
	internalInvoice: null,
	salesReport: null,
	supplierInvoice: null,
	driversExpense: null,
	...props
});

export const defaultExpenseClaim = (props: Partial<ExpenseClaimType> = {}): ExpenseClaimType => ({
	id: '',
	wares: [defaultWare()],
	name: '',
	ssn: '',
	clearingNum: '',
	accountNum: '',
	receiptDate: toDate(),
	paymentDate: null,
	paymentAddedBy: null,
	...props
});

export const defaultExpenseReport = (props: Partial<ExpenseClaimType> = {}): ExpenseReportType => ({
	id: '',
	name: '',
	receiptDate: toDate(),
	wares: [defaultWare()],
	...props
});

export const defaultInternalInvoice = (
	props: Partial<InternalInvoiceType> = {}
): InternalInvoiceType => ({
	id: '',
	wares: [defaultWare()],
	senderName: '',
	senderUtskott: '' as Utskott,
	recipientName: '',
	...props
});

export const defaultSalesReport = (props: Partial<SalesReportType> = {}): SalesReportType => ({
	id: '',
	salesFeeInCents: 0,
	totalSalesInCents: 0,
	projectNumber: null,
	wares: [],
	...props
});

export const defaultSupplierInvoice = (
	props: Partial<SupplierInvoiceType> = {}
): SupplierInvoiceType => ({
	id: '',
	invoiceNumber: '',
	companyName: '',
	companyNumber: '',
	ocr: '',
	dueDate: toDate(),
	...props
});

export const defaultDriversExpense = (
	props: Partial<DriversExpenseType> = {}
): DriversExpenseType => ({
	id: '',
	miles: 0,
	ticketPriceInCents: 0,
	name: '',
	destination: '',
	ssn: '',
	clearingNum: '',
	accountNum: '',
	paymentDate: null,
	paymentAddedBy: null,
	milesCompensationInCents: 0,
	...props
});
