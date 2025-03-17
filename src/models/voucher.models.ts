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

type Reduced<T, K extends keyof T> = Omit<T, K>;
type FormFields<A, B extends Record<keyof A, any>> = B;
type Select<A, K extends keyof A> = Pick<Record<keyof A, true>, K>;
type FormEnum<T> = Record<Uppercase<Extract<keyof T, string>>, Extract<keyof T, string>>;

/*
 *
 *	"Form" for FormData to Json and form input bindings
 *	If the type has any field that is not a string or File,
 *	the submitted input must be a stringified json that is parsed.
 *
 */

export type FormWare = FormFields<
	Reduced<Prisma.WareSelect, 'id' | 'voucherId' | 'voucher'>,
	{
		label: string;
		suggestedAccountId: number | null;
		costInCents: number;
	}
>;

export type FormAccount = FormFields<
	Reduced<Prisma.AccountSelect, never>, //Nothing to reduce
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

export type FormNewVoucher = FormFields<
	Reduced<
		Prisma.VoucherSelect,
		| 'id'
		| 'verNr'
		| 'transactionDate'
		| 'dateTurnedIn'
		| 'receiptUrl'
		| 'accounting'
		| '_count'
		| 'privateVoucher'
	>,
	{
		name: string;
		utskott: string;
		description: string;
		receiptDate: string;
		wares: string;
		receipt: File;
	}
>;
export const FormNewVoucherNames: FormEnum<FormNewVoucher> = {
	NAME: 'name',
	UTSKOTT: 'utskott',
	DESCRIPTION: 'description',
	RECEIPTDATE: 'receiptDate',
	RECEIPT: 'receipt',
	WARES: 'wares'
};

export type FormNewPrivateVoucher = FormFields<
	Reduced<Prisma.PrivateVoucherSelect, 'id' | 'paymentAddedBy' | 'paymentDate' | 'voucher'>,
	FormNewVoucher & {
		ssn: string;
		clearingNum: string;
		accountNum: string;
	}
>;
export const FormNewPrivateVoucherNames: FormEnum<FormNewPrivateVoucher> = {
	...FormNewVoucherNames,
	SSN: 'ssn',
	CLEARINGNUM: 'clearingNum',
	ACCOUNTNUM: 'accountNum'
};

export type FormAccountingEntry = FormFields<
	Reduced<
		Prisma.AccountingEntrySelect,
		'id' | 'profitCenter' | 'voucherId' | 'voucher' | 'project'
	>,
	{
		name: string;
		number: number;
		profitCenterName: string;
		projectNumber: number;
		debetInCents: number;
		kreditInCents: number;
	}
>;

export type FormProfitCenter = FormFields<
	Reduced<Prisma.ProfitCenterSelect, '_count' | 'accountingEntry'>,
	{
		name: string;
		utskott: string;
	}
>;
export const FormProfitCenterNames: FormEnum<FormProfitCenter> = {
	NAME: 'name',
	UTSKOTT: 'utskott'
};

export type FormDeleteProfitCenter = FormFields<
	Reduced<Prisma.ProfitCenterSelect, '_count' | 'accountingEntry' | 'utskott'>,
	{
		name: string;
	}
>;
export const FormDeleteProfitCenterNames: FormEnum<FormDeleteProfitCenter> = {
	NAME: 'name'
};

export type FormDeleteAccount = FormFields<
	Reduced<Prisma.AccountSelect, 'accountingLabel' | 'voucherLabel'>,
	{
		number: string;
	}
>;
export const FormDeleteAccountNames: FormEnum<FormDeleteAccount> = {
	NUMBER: 'number'
};

export type FormDeleteProject = FormFields<
	Reduced<Prisma.ProjectSelect, '_count' | 'AccountingEntry' | 'name'>,
	{
		number: string;
	}
>;
export const FormDeleteProjectNames: FormEnum<FormDeleteProject> = {
	NUMBER: 'number'
};

export type FormVoucherMod = FormFields<
	Reduced<
		Prisma.VoucherSelect,
		'verNr' | 'transactionDate' | 'dateTurnedIn' | 'receiptUrl' | '_count' | 'privateVoucher'
	>,
	{
		id: string;
		name: string;
		utskott: string;
		description: string;
		receiptDate: string;
		wares: string;
		accounting: string;
	}
>;
export const FormVoucherModNames: FormEnum<FormVoucherMod> = {
	NAME: 'name',
	UTSKOTT: 'utskott',
	DESCRIPTION: 'description',
	RECEIPTDATE: 'receiptDate',
	WARES: 'wares',
	ACCOUNTING: 'accounting',
	ID: 'id'
};

export type FormPrivateVoucherMod = FormFields<
	Reduced<Prisma.PrivateVoucherSelect, 'id' | 'paymentAddedBy' | 'paymentDate' | 'voucher'>,
	FormVoucherMod & {
		ssn: string;
		clearingNum: string;
		accountNum: string;
	}
>;
export const FormPrivateVoucherModNames: FormEnum<FormPrivateVoucherMod> = {
	...FormVoucherModNames,
	SSN: 'ssn',
	CLEARINGNUM: 'clearingNum',
	ACCOUNTNUM: 'accountNum'
};

export type FormProject = FormFields<
	Reduced<Prisma.ProjectSelect, 'AccountingEntry' | '_count'>,
	{
		number: string;
		name: string;
	}
>;
export const FormProjectNames: FormEnum<FormProject> = {
	NAME: 'name',
	NUMBER: 'number'
};

/*
 *
 *	"New" for the type used when creating or updating a DB entry
 *
 */
type NewWareSelection = Select<Ware, 'label' | 'suggestedAccountId' | 'costInCents'>;
export type NewWare = Prisma.WareGetPayload<{
	select: NewWareSelection;
}>;

type NewVoucherSelection = Select<
	Voucher,
	'dateTurnedIn' | 'receiptUrl' | 'receiptDate' | 'utskott' | 'description' | 'name'
>;

export type NewVoucher = Prisma.VoucherGetPayload<{
	select: NewVoucherSelection & { wares: { select: NewWareSelection } };
}>;

type NewPrivateVoucherSelection = Select<PrivateVoucher, 'accountNum' | 'clearingNum' | 'ssn'>;
export type NewPrivateVoucher = Prisma.PrivateVoucherGetPayload<{
	select: NewPrivateVoucherSelection & {
		voucher: { select: NewVoucherSelection & { wares: { select: NewWareSelection } } };
	};
}>;

type NewAccountSelection = Select<Account, 'number' | 'accountingLabel' | 'voucherLabel'>;
export type NewAccount = Prisma.AccountGetPayload<{
	select: NewAccountSelection;
}>;

type NewProfitCenterSelection = Select<ProfitCenter, 'name' | 'utskott'>;
export type NewProfitCenter = Prisma.ProfitCenterGetPayload<{
	select: NewProfitCenterSelection;
}>;

type NewAccountingEntrySelection = Select<
	AccountingEntry,
	'debetInCents' | 'kreditInCents' | 'name' | 'number' | 'projectNumber' | 'profitCenterName'
>;
export type NewAccountingEntry = Prisma.AccountingEntryGetPayload<{
	select: NewAccountingEntrySelection;
}>;

type NewVoucherModSelection = Select<
	Voucher,
	'id' | 'name' | 'utskott' | 'description' | 'receiptDate'
>;
export type NewVoucherMod = Prisma.VoucherGetPayload<{
	select: NewVoucherModSelection & {
		wares: {
			select: NewWareSelection;
		};
		accounting: {
			select: NewAccountingEntrySelection;
		};
	};
}>;

type NewPrivateVoucherModSelection = Select<PrivateVoucher, 'accountNum' | 'clearingNum' | 'ssn'>;
export type NewPrivateVoucherMod = Prisma.PrivateVoucherGetPayload<{
	select: NewPrivateVoucherModSelection & {
		voucher: {
			select: NewVoucherModSelection & {
				wares: { select: NewWareSelection };
				accounting: {
					select: NewAccountingEntrySelection;
				};
			};
		};
	};
}>;

type NewProjectSelection = Select<Project, 'name' | 'number'>;
export type NewProject = Prisma.ProjectGetPayload<{
	select: NewProjectSelection;
}>;
/*
 *
 *	"Type" for models with commonly added include fields
 *
 */
export type VoucherType = Prisma.VoucherGetPayload<{
	include: { wares: true; accounting: { include: { profitCenter: true } } };
}>;
export type PrivateVoucherType = Prisma.PrivateVoucherGetPayload<{
	include: {
		voucher: { include: { wares: true; accounting: { include: { profitCenter: true } } } };
	};
}>;
export type AccountingEntryType = Prisma.AccountingEntryGetPayload<{
	include: { profitCenter: true };
}>;
