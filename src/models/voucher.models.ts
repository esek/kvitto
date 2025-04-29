import {
	Prisma,
	type Account,
	type AccountingEntry,
	type PrivateVoucher,
	type ProfitCenter,
	type Project,
	type Voucher,
	type Ware
} from '@prisma/client';

type FormFields<A, B extends Record<keyof A, any>> = B;

type Select<A, K extends keyof A> = Pick<Record<keyof A, true>, K>;
type FormEnum<T> = Record<Uppercase<Extract<keyof T, string>>, Extract<keyof T, string>>;
type JsonString<T> = string & { readonly __jsonType__: T };

/*
 *
 *	"Form" for FormData to Json and form input bindings
 *	StringifiedJson is used to signify that the incoming string is
 * 	supposed to be parsed as a json object
 *
 */

export type FormProject = FormFields<
	Project,
	{
		number: string;
		name: string;
	}
>;
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
		accountNumber: number | null;
		costInCents: number;
		voucherId: number | null;
	}
>;
export const FormWareNames: FormEnum<FormWare> = {
	ID: 'id',
	LABEL: 'label',
	ACCOUNTNUMBER: 'accountNumber',
	COSTINCENTS: 'costInCents',
	VOUCHERID: 'voucherId'
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
		voucherId: number | null;
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

export type FormPrivateVoucher = FormFields<
	PrivateVoucher,
	{
		id: string | null;
		paymentDate: string | null;
		paymentAddedBy: string | null;
		ssn: string;
		clearingNum: string;
		accountNum: string;
	}
>;
export const FormPrivateVoucherNames: FormEnum<FormPrivateVoucher> = {
	ID: 'id',
	PAYMENTADDEDBY: 'paymentAddedBy',
	PAYMENTDATE: 'paymentDate',
	SSN: 'ssn',
	CLEARINGNUM: 'clearingNum',
	ACCOUNTNUM: 'accountNum'
};

export type FormVoucher = FormFields<
	Voucher,
	{
		id: string | null;
		verNr: string | null;
		dateTurnedIn: string | null;
		transactionDate: string | null;
		receiptUrl: string | null;
		name: string;
		utskott: string;
		description: string;
		receiptDate: string;
		wares: JsonString<FormWare> | null;
		accounting: JsonString<FormAccountingEntry> | null;
		privateVoucher: JsonString<FormPrivateVoucher> | null;
		receipt: File | null;
	}
>;
export const FormVoucherNames: FormEnum<FormVoucher> = {
	ID: 'id',
	NAME: 'name',
	UTSKOTT: 'utskott',
	DESCRIPTION: 'description',
	RECEIPTDATE: 'receiptDate',
	WARES: 'wares',
	ACCOUNTING: 'accounting',
	PRIVATEVOUCHER: 'privateVoucher',
	RECEIPT: 'receipt',
	RECEIPTURL: 'receiptUrl',
	TRANSACTIONDATE: 'transactionDate',
	DATETURNEDIN: 'dateTurnedIn',
	VERNR: 'verNr'
};

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
type NewWareSelection = Select<Ware, 'label' | 'accountNumber' | 'costInCents'>;
export type NewWare = Prisma.WareGetPayload<{
	select: NewWareSelection;
}>;

type NewAccountingEntrySelection = Select<
	AccountingEntry,
	| 'debetInCents'
	| 'kreditInCents'
	| 'projectNumber'
	| 'profitCenterName'
	| 'accountNumber'
	| 'voucherId'
>;
export type NewAccountingEntry = Prisma.AccountingEntryGetPayload<{
	select: NewAccountingEntrySelection;
}>;

type NewPrivateVoucherSelection = Select<PrivateVoucher, 'accountNum' | 'clearingNum' | 'ssn'>;
export type NewPrivateVoucher = Prisma.PrivateVoucherGetPayload<{
	select: NewPrivateVoucherSelection;
}>;

type NewVoucherSelection = Select<
	Voucher,
	'dateTurnedIn' | 'receiptUrl' | 'receiptDate' | 'utskott' | 'description' | 'name'
>;
export type NewVoucher = Prisma.VoucherGetPayload<{
	select: NewVoucherSelection & {
		wares: { select: NewWareSelection };
		privateVoucher: { select: NewPrivateVoucherSelection };
	};
}>;

/*
 *
 *	"Updated" for types used when updating DB entries
 *
 */
type UpdatedWareSelection = Select<Ware, 'id' | 'label' | 'accountNumber' | 'costInCents'>;
export type UpdatedWare = Prisma.WareGetPayload<{
	select: UpdatedWareSelection;
}>;

type UpdatedAccountingEntrySelection = Select<
	AccountingEntry,
	'id' | 'debetInCents' | 'kreditInCents' | 'accountNumber' | 'projectNumber' | 'profitCenterName'
>;
export type UpdatedAccountingEntry = Prisma.AccountingEntryGetPayload<{
	select: UpdatedAccountingEntrySelection;
}>;

type UpdatedPrivateVoucherSelection = Select<PrivateVoucher, 'accountNum' | 'clearingNum' | 'ssn'>;
export type UpdatedPrivateVoucher = Prisma.PrivateVoucherGetPayload<{
	select: UpdatedPrivateVoucherSelection;
}>;

type UpdatedVoucherSelection = Select<
	Voucher,
	'id' | 'name' | 'utskott' | 'description' | 'receiptDate'
>;
export type UpdatedVoucher = Prisma.VoucherGetPayload<{
	select: UpdatedVoucherSelection & {
		wares: {
			select: UpdatedWareSelection;
		};
		accounting: {
			select: UpdatedAccountingEntrySelection;
		};
		privateVoucher: {
			select: UpdatedPrivateVoucherSelection;
		};
	};
}>;
/*
 *
 *	"Type" for models with commonly added include fields
 *
 */
export type VoucherType = Prisma.VoucherGetPayload<{
	include: {
		wares: { include: { suggestedAccount: true } };
		accounting: { include: { profitCenter: true; account: true; project: true } };
		privateVoucher: true;
	};
}>;
export type AccountingEntryType = Prisma.AccountingEntryGetPayload<{
	include: { profitCenter: true; project: true; account: true };
}>;
export type WareType = Prisma.WareGetPayload<{
	include: { suggestedAccount: true };
}>;
