import {
	type NewAccount,
	type NewProfitCenter,
	type NewVoucher,
	type NewWare,
	type FormAccount,
	type FormNewPrivateVoucher,
	type FormProfitCenter,
	type FormNewVoucher,
	type FormWare,
	type NewPrivateVoucher,
	type NewAccountingEntry,
	type FormVoucherMod,
	type NewVoucherMod,
	type FormAccountingEntry,
	type FormPrivateVoucherMod,
	type NewPrivateVoucherMod,
	type FormProject,
	type NewProject
} from '@/models/voucher.models';
import { toDate } from './date.helpers';
import type { Account, ProfitCenter, Project, Utskott } from '@prisma/client';
import type { IOption } from '@/models/form.models';
import { stringToJson } from './form.helpers';

const makeNewWares = (formWares: FormWare[]): NewWare[] => {
	return formWares.map((w) => {
		return {
			label: w.label,
			suggestedAccountId: w.suggestedAccountId ?? null,
			costInCents: w.costInCents
		};
	});
};

export const makeNewVoucher = (formVoucher: FormNewVoucher): NewVoucher => {
	const formWares = stringToJson<FormWare[]>(formVoucher.wares);
	const newWares = makeNewWares(formWares);
	const newVoucher: NewVoucher = {
		wares: newWares ?? [],
		dateTurnedIn: toDate(),
		receiptUrl: formVoucher.receipt.name,
		receiptDate: toDate(formVoucher.receiptDate),
		utskott: formVoucher.utskott as Utskott,
		description: formVoucher.description,
		name: formVoucher.name
	};
	return newVoucher;
};

export const makeNewPrivateVoucher = (
	formPrivateVoucher: FormNewPrivateVoucher
): NewPrivateVoucher => {
	const newVoucher = makeNewVoucher(formPrivateVoucher);
	return {
		voucher: newVoucher,
		ssn: formPrivateVoucher.ssn,
		clearingNum: formPrivateVoucher.clearingNum,
		accountNum: formPrivateVoucher.accountNum
	};
};

export const makeNewVoucherMod = (formVoucher: FormVoucherMod): NewVoucherMod => {
	const formWares = stringToJson<FormWare[]>(formVoucher.wares);
	const newWares = makeNewWares(formWares);
	const formAccounting = stringToJson<FormAccountingEntry[]>(formVoucher.accounting);
	const newAccounting = makeNewAccounting(formAccounting);
	const newVoucherMod: NewVoucherMod = {
		id: parseInt(formVoucher.id),
		wares: newWares ?? [],
		accounting: newAccounting ?? [],
		receiptDate: toDate(formVoucher.receiptDate),
		description: formVoucher.description,
		name: formVoucher.name,
		utskott: formVoucher.utskott as Utskott
	};
	return newVoucherMod;
};

export const makeNewPrivateVoucherMod = (
	formPrivateVoucher: FormPrivateVoucherMod
): NewPrivateVoucherMod => {
	const newVoucherMod = makeNewVoucherMod(formPrivateVoucher);
	const newPrivateVoucherMod: NewPrivateVoucherMod = {
		voucher: newVoucherMod,
		ssn: formPrivateVoucher.ssn,
		clearingNum: formPrivateVoucher.clearingNum,
		accountNum: formPrivateVoucher.accountNum
	};
	return newPrivateVoucherMod;
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

export const makeNewAccount = (formAccount: FormAccount): NewAccount => {
	return {
		number: parseInt(formAccount.number),
		voucherLabel: formAccount.voucherLabel,
		accountingLabel: formAccount.accountingLabel
	};
};

export const makeNewAccounting = (formAccounting: FormAccountingEntry[]): NewAccountingEntry[] => {
	return formAccounting.map((a) => ({
		name: a.name,
		number: a.number,
		projectNumber: a.projectNumber ? Number(a.projectNumber) : null,
		profitCenterName: a.profitCenterName ? a.profitCenterName : null,
		kreditInCents: a.kreditInCents,
		debetInCents: a.debetInCents
	}));
};

export const makeNewProfitCenter = (formProfitCenter: FormProfitCenter): NewProfitCenter => {
	return {
		name: formProfitCenter.name,
		utskott: formProfitCenter.utskott as Utskott
	};
};

export const makeNewProject = (formProject: FormProject): NewProject => {
	return {
		name: formProject.name,
		number: parseInt(formProject.number)
	};
};

export const generateAccounting = (
	wares: NewWare[],
	accounts: Account[],
	profitCenters: ProfitCenter[],
	utskott: Utskott
): NewAccountingEntry[] => {
	let sumTotal = 0;
	wares.forEach((w) => (sumTotal += w.costInCents));

	const bank: NewAccountingEntry[] = [
		{
			name: 'Bank',
			number: 1920,
			debetInCents: 0,
			kreditInCents: sumTotal,
			profitCenterName: null,
			projectNumber: null
		}
	];
	const profitCenter = profitCenters.findLast((pc) => pc.utskott === utskott);

	const accounting: NewAccountingEntry[] = wares.map((w) => {
		const account = accounts.find((a) => a.number === w.suggestedAccountId);
		if (!account) {
			return {
				name: w.label,
				number: 0,
				debetInCents: w.costInCents,
				kreditInCents: 0,
				profitCenterName: null,
				projectNumber: null
			};
		}
		return {
			name: account.accountingLabel,
			number: account.number,
			debetInCents: w.costInCents,
			kreditInCents: 0,
			profitCenterName: profitCenter?.name ?? null,
			projectNumber: null
		};
	});

	return bank.concat(accounting);
};
