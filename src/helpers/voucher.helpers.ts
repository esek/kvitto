import { type AccountingEntryType, type VoucherType } from '@/models/voucher.models';
import { type Account, type ProfitCenter, type Project, type Supplier } from '@prisma/client';
import type { IOption } from '@/models/form.models';
import { defaultAccountingEntry } from '@/constants/voucher.constants';
import {
	ACCOUNT_NUMBERS,
	PROFIT_CENTER_NAMES,
	PROJECT_NUMBERS
} from '@/constants/accounting.constants';

export const getAccountOptionsForVouchers = (accounts: Account[]): IOption[] => {
	return accounts
		.filter((a) => a.number.toString() !== a.voucherLabel)
		.map((a) => ({ label: a.voucherLabel, value: a.number }));
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

export const getSuppliersForVouchers = (suppliers: Supplier[]): IOption[] => {
	return suppliers.map((s) => ({ label: s.name, value: s.number }));
};

export const centsToCrownsString = (cents: number) => {
	return (
		(cents - (cents % 100)) / 100 + ',' + (cents % 100).toString().replace('-', '').padStart(2, '0')
	);
};

export const crownsFromCents = (cents: number) => {
	return (cents - (cents % 100)) / 100;
};

export const generateAccountingForVoucher = (
	voucher: VoucherType,
	profitCenters: ProfitCenter[],
	accounts: Account[],
	projects: Project[]
): AccountingEntryType[] => {
	const pc = profitCenters.find((pc) => pc.utskott === voucher.utskott) ?? null;

	const ec = voucher.expenseClaim;
	const er = voucher.expenseReport;
	const ii = voucher.internalInvoice;
	const de = voucher.driversExpense;
	const sr = voucher.salesReport;

	let sum = 0;
	if (de) {
		sum += de.milesCompensationInCents * de.miles + de.ticketPriceInCents;
	}

	const wares = [ec?.wares, er?.wares, ii?.wares, sr?.wares].filter((w) => w !== undefined).flat();

	const accounting = wares.map((w) => {
		const account = w.suggestedAccount ?? accounts.find((a) => a.number === w.accountNumber);
		const accountingEntry: AccountingEntryType = defaultAccountingEntry({
			voucherId: voucher.id,
			accountNumber: w.accountNumber ?? null,
			account: account ?? null,
			debetInCents: w.unitPriceInCents * w.quantity,
			kreditInCents: 0,
			profitCenterName: pc?.name ?? null,
			projectNumber: null
		});
		sum += w.unitPriceInCents * w.quantity;
		return accountingEntry;
	});

	if (sr) {
		sum = sr.salesFeeInCents + sr.totalSalesInCents;
	}

	//If it's an internal invoice, we balance the accoutning with
	//opposite and equal transactions from the sender
	if (ii) {
		const kreditPc = profitCenters.find((pc) => pc.utskott === ii.senderUtskott);
		const kreditAccounting: AccountingEntryType[] = accounting.map((a) => ({
			...a,
			debetInCents: 0,
			kreditInCents: a.debetInCents,
			profitCenterName: kreditPc?.name ?? null,
			accountNumber: null
		}));
		return kreditAccounting.concat(accounting);
	}

	//If we have not already returned, we assume taking the money from the bank
	const bankAccount = accounts.find((a) => a.number === ACCOUNT_NUMBERS.BANK);
	const bankEntry: AccountingEntryType = defaultAccountingEntry({
		voucherId: voucher.id,
		account: bankAccount ?? null,
		accountNumber: bankAccount?.number ?? null,
		profitCenterName: null,
		projectNumber: null,
		debetInCents: 0,
		kreditInCents: sum
	});

	if (de) {
		const driversCostAccount = accounts.find((a) => a.number === ACCOUNT_NUMBERS.DRIVERS_COST);
		const driversCostEntry: AccountingEntryType = defaultAccountingEntry({
			voucherId: voucher.id,
			account: driversCostAccount ?? null,
			accountNumber: driversCostAccount?.number ?? null,
			profitCenterName: null,
			projectNumber: null,
			debetInCents: sum,
			kreditInCents: 0
		});
		return [bankEntry].concat(driversCostEntry);
	}

	const accountingWithBank = [bankEntry].concat(accounting);

	if (sr) {
		const transactionFeeAccount = accounts.find(
			(a) => a.number === ACCOUNT_NUMBERS.TRANSACTION_FEE
		);
		const transactionFeePC = profitCenters.find(
			(p) => p.name === PROFIT_CENTER_NAMES.TRANSACTION_FEE
		);
		const transactionFeeProject = projects.find(
			(p) => p.number === PROJECT_NUMBERS.TRANSACTION_FEE
		);
		const transactionFeeEntry: AccountingEntryType = defaultAccountingEntry({
			voucherId: voucher.id,
			account: transactionFeeAccount ?? null,
			accountNumber: transactionFeeAccount?.number ?? null,
			profitCenterName: transactionFeePC?.name ?? null,
			projectNumber: transactionFeeProject?.number ?? null,
			debetInCents: sr.salesFeeInCents,
			kreditInCents: 0
		});
		return accountingWithBank.concat(transactionFeeEntry);
	}
	return accountingWithBank;
};
