import {
	Utskott,
	VoucherSeries,
	type Account,
	type ProfitCenter,
	type Project
} from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import type {
	AccountingEntryType,
	DriversExpenseType,
	ExpenseClaimType,
	ExpenseReportType,
	InternalInvoiceType,
	LedReport,
	SalesReportType,
	SupplierInvoiceType,
	VoucherType,
	WareType
} from './voucher.models';

const utskottEnum = z.nativeEnum(Utskott, {
	errorMap: (_issue, _ctx) => {
		return { message: 'Utskottet är ogiltigt' };
	}
});

const seriesEnum = z.nativeEnum(VoucherSeries, {
	errorMap: (_issue, _ctx) => {
		return { message: 'Serien är ogiltig' };
	}
});

export const profitCenterSchema: z.ZodType<ProfitCenter> = z.object({
	name: z
		.string({
			required_error: 'Namn krävs',
			invalid_type_error: 'Namn måste vara en sträng'
		})
		.min(1, { message: 'Namn får inte vara tomt' }),
	utskott: utskottEnum
});

export const projectSchema: z.ZodType<Project> = z.object({
	number: z.number({
		required_error: 'Projektnummer krävs',
		invalid_type_error: 'Projektnummer krävs'
	}),
	name: z
		.string({
			required_error: 'Namn krävs',
			invalid_type_error: 'Namn måste vara en sträng'
		})
		.min(1, { message: 'Namn får inte vara tomt' })
});

export const accountTypeSchema: z.ZodType<Account> = z.object({
	number: z
		.number({
			required_error: 'Kontonummer krävs',
			invalid_type_error: 'Kontonummer krävs'
		})
		.refine((val) => /^\d{4}$/.test(val.toString()), {
			message: 'Kontonumret måste vara ett fyrsiffrigt tal'
		}),
	voucherLabel: z
		.string({
			required_error: 'Verifikatetikett krävs',
			invalid_type_error: 'Verifikatetiketten måste vara en sträng'
		})
		.min(1, { message: 'Verifikatetikett får inte vara tomt' }),
	accountingLabel: z
		.string({
			required_error: 'Bokföringsetikett krävs',
			invalid_type_error: 'Bokföringsetikett måste vara en sträng'
		})
		.min(1, { message: 'Bokföringsetikett får inte vara tomt' })
});

const accountingEntrySchema: z.ZodType<AccountingEntryType> = z.object({
	id: z.number(),
	voucherId: z.string().nullable(),
	accountNumber: z
		.number({
			required_error: 'Kontonummer krävs',
			invalid_type_error: 'Kontonummer krävs'
		})
		.refine(
			async (val) => {
				const prisma = new PrismaClient();
				return !!(await prisma.account.findFirst({ where: { number: val } }));
			},
			{
				message: 'Kontonumret existerar inte'
			}
		),
	account: accountTypeSchema.nullable(),
	debetInCents: z.number(),
	kreditInCents: z.number(),
	profitCenterName: z
		.string()
		.refine(
			async (val) => {
				const prisma = new PrismaClient();
				return !!(await prisma.profitCenter.findFirst({ where: { name: val } }));
			},
			{
				message: 'Kostnadsstället existerar inte'
			}
		)
		.nullable(),
	profitCenter: profitCenterSchema.nullable(),
	projectNumber: z
		.number()
		.refine(
			async (val) => {
				const prisma = new PrismaClient();
				return !!(await prisma.project.findFirst({ where: { number: val } }));
			},
			{
				message: 'Projektnumret existerar inte'
			}
		)
		.nullable(),
	project: projectSchema.nullable()
});

const wareTypeSchema: z.ZodType<WareType> = z.object({
	id: z.number(),
	label: z.string(),
	unitPriceInCents: z.number(),
	quantity: z.number({
		required_error: 'Antal krävs',
		invalid_type_error: 'Antal måste vara ett nummer'
	}),
	accountNumber: z.number().nullable(),
	suggestedAccount: accountTypeSchema.nullable(),
	expenseClaimId: z.string().nullable(),
	expenseReportId: z.string().nullable(),
	internalInvoiceId: z.string().nullable(),
	salesReportId: z.string().nullable()
});

const expenseClaimSchema: z.ZodType<ExpenseClaimType> = z.object({
	id: z.string(),
	name: z.string(),
	ssn: z.string(),
	clearingNum: z.string(),
	accountNum: z.string(),
	receiptDate: z.date(),
	paymentDate: z.date().nullable(),
	paymentAddedBy: z.string().nullable(),
	wares: wareTypeSchema.array()
});

const expenseReportSchema: z.ZodType<ExpenseReportType> = z.object({
	id: z.string(),
	name: z.string(),
	receiptDate: z.date(),
	wares: wareTypeSchema.array()
});

const internalInvoiceSchema: z.ZodType<InternalInvoiceType> = z
	.object({
		id: z.string(),
		senderName: z.string().nullable(),
		senderUtskott: utskottEnum.nullable(),
		recipientName: z.string(),
		wares: wareTypeSchema.array()
	})
	.refine((data) => !(data.senderName === null && data.senderUtskott !== null), {
		message: 'Om leverantörsutskott är angivet måste även leverantörsnamn vara angivet',
		path: ['senderName']
	})
	.refine((data) => !(data.senderName !== null && data.senderUtskott === null), {
		message: 'Om leverantörsnamn är angivet måste även leverantörsutskott vara angivet',
		path: ['senderUtskott']
	});

const salesReportSchema: z.ZodType<SalesReportType> = z.object({
	id: z.string(),
	salesFeeInCents: z.number(),
	totalSalesInCents: z.number(),
	projectNumber: z.number().nullable(),
	wares: wareTypeSchema.array()
});

const supplierInvoiceSchema: z.ZodType<SupplierInvoiceType> = z.object({
	id: z.string(),
	invoiceNumber: z.string(),
	companyName: z.string(),
	companyNumber: z
		.string()
		.refine(
			async (val) => {
				const prisma = new PrismaClient();
				return !!(await prisma.supplier.findFirst({ where: { number: val } }));
			},
			{
				message: 'Leverantörsnumret existerar inte'
			}
		)
		.nullable(),
	ocr: z.string(),
	dueDate: z.date()
});

const driversExpenseSchema: z.ZodType<DriversExpenseType> = z.object({
	id: z.string(),
	name: z.string(),
	ssn: z.string(),
	destination: z.string(),
	clearingNum: z.string(),
	accountNum: z.string(),
	paymentDate: z.date().nullable(),
	paymentAddedBy: z.string().nullable(),
	miles: z.number(),
	ticketPriceInCents: z.number(),
	milesCompensationInCents: z.number()
});

export const voucherSchema: z.ZodType<VoucherType> = z.object({
	id: z.string(),
	dateTurnedIn: z.date(),
	description: z.string(),
	series: seriesEnum,
	accounting: accountingEntrySchema.array(),
	attachmentUrl: z.string().nullable(),
	label: z.string().nullable(),
	transactionDate: z.date().nullable(),
	approvedBy: z.string().nullable(),
	approvedAt: z.date().nullable(),
	accountedBy: z.string().nullable(),
	comment: z.string().nullable(),
	utskott: utskottEnum,
	reference: z.string().nullable(),
	expenseClaim: expenseClaimSchema.nullable(),
	expenseReport: expenseReportSchema.nullable(),
	internalInvoice: internalInvoiceSchema.nullable(),
	salesReport: salesReportSchema.nullable(),
	supplierInvoice: supplierInvoiceSchema.nullable(),
	driversExpense: driversExpenseSchema.nullable(),
	referenceEmail: z.string().nullable(),
	paid: z.boolean(),
	archived: z.boolean(),
	accounted: z.boolean()
});

//essentialy the same schemas just without nullable fields.
const fortnoxExpenseClaimSchema: z.ZodType<ExpenseClaimType> = z.object({
	id: z.string(),
	name: z.string(),
	ssn: z.string(),
	clearingNum: z.string(),
	accountNum: z.string(),
	receiptDate: z.date(),
	paymentDate: z.date({
		required_error: 'Datum för utbetalning krävs',
		invalid_type_error: 'Datum för utbetalning måste vara ett giltigt datum'
	}),
	paymentAddedBy: z
		.string({
			required_error: 'Namn tillhörande utbetalning krävs',
			invalid_type_error: 'Namn tillhörande utbetalning måste vara en sträng'
		})
		.min(1, { message: 'Namn tillhörande utbetalning får inte vara tomt' }),
	wares: wareTypeSchema.array()
});

const fortnoxDriversExpenseSchema: z.ZodType<DriversExpenseType> = z.object({
	id: z.string(),
	name: z.string(),
	ssn: z.string(),
	destination: z.string(),
	clearingNum: z.string(),
	accountNum: z.string(),
	paymentDate: z.date({
		required_error: 'Datum för utbetalning krävs',
		invalid_type_error: 'Datum för utbetalning måste vara ett giltigt datum'
	}),
	paymentAddedBy: z
		.string({
			required_error: 'Namn tillhörande utbetalning krävs',
			invalid_type_error: 'Namn tillhörande utbetalning måste vara en sträng'
		})
		.min(1, { message: 'Namn tillhörande utbetalning får inte vara tomt' }),
	miles: z.number(),
	ticketPriceInCents: z.number(),
	milesCompensationInCents: z.number()
});

const fortnoxSupplierInvoiceSchema: z.ZodType<SupplierInvoiceType> = z.object({
	id: z.string(),
	invoiceNumber: z.string(),
	companyName: z.string(),
	companyNumber: z
		.string({
			required_error: 'Leverantörsnummer krävs',
			invalid_type_error: 'Leverantörsnummer måste vara en sträng'
		})
		.min(1, { message: 'Leverantörsnummer får inte vara tomt' })
		.refine(
			async (val) => {
				const prisma = new PrismaClient();
				return !!(await prisma.supplier.findFirst({ where: { number: val } }));
			},
			{
				message: 'Leverantörsnumret existerar inte'
			}
		),
	ocr: z.string(),
	dueDate: z.date()
});

export const fortnoxVoucherSchema: z.ZodType<VoucherType> = z.object({
	id: z.string(),
	dateTurnedIn: z.date({
		required_error: 'Inlämningsdatum krävs',
		invalid_type_error: 'Inlämningsdatum måste vara ett giltigt datum'
	}),
	description: z
		.string({
			required_error: 'Beskrivning krävs',
			invalid_type_error: 'Beskrivning måste vara en sträng'
		})
		.max(50, { message: 'Beskrivning får inte vara för lång' })
		.min(1, { message: 'Beskrivning får inte vara tomt' }),
	series: seriesEnum,
	accounting: accountingEntrySchema.array(),
	attachmentUrl: z.string().nullable(),
	label: z
		.string({
			required_error: 'Etikett krävs',
			invalid_type_error: 'Etikett måste vara en sträng'
		})
		.min(1, { message: 'Etikett får inte vara tomt' }),
	transactionDate: z.date({
		required_error: 'Transaktionsdatum krävs',
		invalid_type_error: 'Transaktionsdatum måste vara ett giltigt datum'
	}),
	approvedBy: z
		.string({
			required_error: 'Godkännande krävs',
			invalid_type_error: 'Godkännande krävs'
		})
		.min(1, { message: 'Godkäntfältet får inte vara tomt' }),
	approvedAt: z.date({
		required_error: 'Godkännande krävs',
		invalid_type_error: 'Godkännande måste vara ett giltigt datum'
	}),
	accountedBy: z
		.string({
			required_error: 'Bokföringansvarig krävs',
			invalid_type_error: 'Bokföringansvarig måste vara en namnsträng'
		})
		.min(1, { message: 'Bokföringansvarigfältet får inte vara tomt' }),
	comment: z.string().nullable(),
	reference: z.string().nullable(),
	utskott: utskottEnum,
	expenseClaim: fortnoxExpenseClaimSchema.nullable(),
	expenseReport: expenseReportSchema.nullable(),
	internalInvoice: internalInvoiceSchema.nullable(),
	salesReport: salesReportSchema.nullable(),
	supplierInvoice: fortnoxSupplierInvoiceSchema.nullable(),
	driversExpense: fortnoxDriversExpenseSchema.nullable(),
	referenceEmail: z.string().nullable(),
	paid: z.boolean(),
	archived: z.boolean(),
	accounted: z
		.boolean()
		.refine(async (val) => !val, { message: 'Kan inte bokföra redan bokförda verifikat' })
});

export const ledReportSchema: z.ZodType<LedReport> = z
	.object({
		readingPeriod: z
			.number({
				required_error: 'Läsperiod krävs',
				invalid_type_error: 'Läsperiod krävs'
			})
			.refine(
				async (val) => {
					return val > 0 && val <= 4;
				},
				{
					message: 'Läsperioden existerar inte'
				}
			),
		readingWeek: z
			.number({
				required_error: 'Läsvecka krävs',
				invalid_type_error: 'Läsvecka krävs'
			})
			.refine(
				async (val) => {
					return val >= 0 && val <= 8;
				},
				{
					message: 'Läsveckan existerar inte'
				}
			),
		registerTotalInCents: z.number({
			required_error: 'Kassaintäkt krävs',
			invalid_type_error: 'Kassaintäkt krävs'
		}),
		transactionFeeInCents: z.number({
			required_error: 'Transaktionsavgift krävs',
			invalid_type_error: 'Transaktionsavgift krävs'
		}),
		patchesTotalInCents: z.number({
			required_error: 'Märkesintäkter krävs',
			invalid_type_error: 'Märkesintäkter krävs'
		}),
		foodTotalInCents: z
			.number({
				required_error: 'Matintäkter krävs',
				invalid_type_error: 'Matintäkter krävs'
			})
			.refine(
				async (val) => {
					return val >= 0;
				},
				{
					message:
						'Matintäkterna kan inte var negativa. Vid inlämning är matintäkter lika med kassaintäkter - märkesintäkter'
				}
			),
		comment: z.string()
	})
	.refine((data) => data.registerTotalInCents - data.transactionFeeInCents >= 0, {
		message:
			'Kassaintäkter kan inte vara mindre än transaktionsavgifterna eftersom avgiften ingår i intäkten',
		path: ['registerTotalInCents']
	});
