import {
	type FormVoucher,
	type FormPrivateVoucher,
	type FormWare,
	type FormAccountingEntry,
	type FormAccount,
	type FormProfitCenter,
	type FormProject,
	type VoucherType,
	type WareType,
	type AccountingEntryType
} from '@/models/voucher.models';
import { toDate } from './date.helpers';
import type { Account, PrivateVoucher, ProfitCenter, Project, Utskott } from '@prisma/client';
import type { IOption } from '@/models/form.models';
import { stringToJson } from './form.helpers';
import type { User } from '@/models/user.models';
import { defaultAccountingEntry } from '@/constants/voucher.constants';

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

const makeWares = (formUpdatedWares: FormWare[]): WareType[] =>
	formUpdatedWares.map((w) => ({
		id: w.id ?? -1,
		label: w.label,
		accountNumber: w.accountNumber,
		costInCents: w.costInCents,
		voucherId: null,
		suggestedAccount: null
	}));

const makeAccounting = (formAccounting: FormAccountingEntry[]): AccountingEntryType[] =>
	formAccounting.map((a) => ({
		id: a.id ?? -1,
		voucherId: a.voucherId,
		accountNumber: a.accountNumber ? parseInt(a.accountNumber.toString()) : null,
		projectNumber: a.projectNumber ? a.projectNumber : null,
		profitCenterName: a.profitCenterName ? a.profitCenterName : null,
		kreditInCents: a.kreditInCents,
		debetInCents: a.debetInCents,
		profitCenter: null,
		project: null,
		account: null
	}));

const makePrivateVoucher = (formPrivateVoucher: FormPrivateVoucher): PrivateVoucher => ({
	id: formPrivateVoucher.id ? parseInt(formPrivateVoucher.id) : -1,
	paymentAddedBy: formPrivateVoucher.paymentAddedBy,
	paymentDate: formPrivateVoucher.paymentDate ? toDate(formPrivateVoucher.paymentDate) : null,
	ssn: formPrivateVoucher.ssn,
	accountNum: formPrivateVoucher.accountNum,
	clearingNum: formPrivateVoucher.clearingNum
});

export const makeVoucher = (formVoucher: FormVoucher): VoucherType => {
	const formWares = stringToJson<FormWare[]>(formVoucher.wares);
	const formAccounting = stringToJson<FormAccountingEntry[]>(formVoucher.accounting);
	const formPrivateVoucher = stringToJson<FormPrivateVoucher>(formVoucher.privateVoucher);

	const wares = formWares ? makeWares(formWares) : [];
	const accounting = formAccounting ? makeAccounting(formAccounting) : [];
	const privateVoucher = formPrivateVoucher ? makePrivateVoucher(formPrivateVoucher) : null;
	const newVoucher: VoucherType = {
		id: formVoucher.id ? parseInt(formVoucher.id) : -1,
		transactionDate: formVoucher.transactionDate ? toDate(formVoucher.transactionDate) : null,
		verNr: formVoucher.verNr ? parseInt(formVoucher.verNr) : null,
		wares: wares,
		dateTurnedIn: toDate(),
		receiptUrl: formVoucher.receiptUrl ?? '',
		receiptDate: toDate(formVoucher.receiptDate),
		utskott: formVoucher.utskott as Utskott,
		description: formVoucher.description,
		name: formVoucher.name,
		privateVoucher: privateVoucher,
		accounting: accounting
	};
	return newVoucher;
};

export const getAccountOptionsForVouchers = (accounts: Account[]): IOption[] => {
	return accounts.map((a) => ({ label: a.voucherLabel, value: a.number }));
};

export const getAccountOptionsForAccounting = (accounts: Account[]): IOption[] => {
	return accounts.map((a) => ({ label: a.accountingLabel, value: a.number }));
};

export const getProfitCenterOptionsForAccounting = (profitCenters: ProfitCenter[]): IOption[] => {
	return profitCenters.map((a) => ({ label: a.name, value: a.name }));
};

export const getProjectOptionsForAccounting = (projects: Project[]): IOption[] => {
	return projects.map((a) => ({ label: a.name, value: a.number }));
};

export const centsToCrownsString = (cents: number) => {
	return (
		(cents - (cents % 100)) / 100 + ',' + (cents % 100).toString().replace('-', '').padStart(2, '0')
	);
};

export const crownsFromCents = (cents: number) => {
	return (cents - (cents % 100)) / 100;
};

export const autofillUserInfo = (user: User, voucher: VoucherType): VoucherType => {
	voucher.name = user.fullName;
	return voucher;
};

export const generateAccountingForVoucher = (
	voucher: VoucherType,
	profitCenters: ProfitCenter[],
	accounts: Account[]
): VoucherType => {
	const wares = voucher.wares;
	const pc = profitCenters.find((pc) => pc.utskott === voucher.utskott) ?? null;

	let sum = 0;
	const accounting = wares.map((w) => {
		const accountingEntry = defaultAccountingEntry();
		accountingEntry.voucherId = voucher.id;
		if (w.accountNumber) {
			const account = w.suggestedAccount ?? accounts.find((a) => a.number === w.accountNumber);
			accountingEntry.account = account ?? null;
		} else {
			accountingEntry.account = {
				number: -1,
				voucherLabel: w.label,
				accountingLabel: w.label
			};
		}
		accountingEntry.accountNumber = w.accountNumber;
		accountingEntry.debetInCents = w.costInCents;
		accountingEntry.profitCenter = pc;
		sum += w.costInCents;
		return accountingEntry;
	});
	const bankEntry = defaultAccountingEntry();
	bankEntry.voucherId = voucher.id;
	bankEntry.account = { number: 1920, accountingLabel: 'Bank', voucherLabel: 'Bank' };
	bankEntry.accountNumber = 1920;
	bankEntry.kreditInCents = sum;
	voucher.accounting = voucher.accounting.concat([bankEntry].concat(accounting));
	return voucher;
};
