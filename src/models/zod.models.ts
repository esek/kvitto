import { Utskott } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const utskottEnum = z.nativeEnum(Utskott, {
	errorMap: (issue, ctx) => {
		return { message: 'Utskott är ogiltigt' };
	}
});

export const profitCenterSchema = z.object({
	name: z
		.string({
			required_error: 'Namn krävs',
			invalid_type_error: 'Namn måste vara en sträng'
		})
		.min(1, { message: 'Namn får inte vara tomt' }),
	utskott: utskottEnum
});

export const projectSchema = z.object({
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

export const accountTypeSchema = z.object({
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

const accountingEntrySchema = z.object({
	id: z.number(),
	voucherId: z.number().nullable(),
	accountNumber: z
		.number()
		.refine(
			async (val) => {
				const prisma = new PrismaClient();
				const accounts = await prisma.account.findMany({});
				return accounts.some((a) => a.number === val);
			},
			{
				message: 'Kontonumret existerar inte'
			}
		)
		.nullable(),
	account: accountTypeSchema.nullable(),
	debetInCents: z.number(),
	kreditInCents: z.number(),
	profitCenterName: z
		.string()
		.refine(
			async (val) => {
				const prisma = new PrismaClient();
				const accounts = await prisma.profitCenter.findMany({});
				return accounts.some((a) => a.name === val);
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
				const accounts = await prisma.project.findMany({});
				return accounts.some((a) => a.number === val);
			},
			{
				message: 'Projektnumret existerar inte'
			}
		)
		.nullable(),
	project: projectSchema.nullable()
});

const wareTypeSchema = z.object({
	id: z.number(),
	label: z.string(),
	costInCents: z.number(),
	voucherId: z.number().nullable(),
	accountNumber: z.number().nullable(),
	suggestedAccount: accountTypeSchema.nullable()
});

const privateVoucherSchema = z.object({
	paymentDate: z.coerce.date().nullable(),
	paymentAddedBy: z.string().nullable(),
	ssn: z.string(),
	clearingNum: z.string(),
	accountNum: z.string()
});

export const voucherSchema = z.object({
	name: z.string(),
	utskott: utskottEnum,
	id: z.number(),
	verNr: z.number().nullable(),
	transactionDate: z.coerce.date().nullable(),
	dateTurnedIn: z.coerce.date(),
	receiptUrl: z.string(),
	receiptDate: z.coerce.date(),
	description: z.string(),
	privateVoucher: privateVoucherSchema.nullable(),
	wares: wareTypeSchema.array(),
	accounting: accountingEntrySchema.array()
});
