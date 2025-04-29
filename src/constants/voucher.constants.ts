import { toDate } from '@/helpers/date.helpers';
import type { AccountingEntryType, VoucherType, WareType } from '@/models/voucher.models';
import type { PrivateVoucher, Utskott } from '@prisma/client';

export const defaultPrivateVoucher = (): PrivateVoucher => ({
	id: -1,
	paymentAddedBy: null,
	paymentDate: null,
	ssn: '',
	clearingNum: '',
	accountNum: ''
});

export const defaultWare = (): WareType => ({
	id: -1,
	voucherId: -1,
	label: '',
	suggestedAccount: null,
	accountNumber: null,
	costInCents: 0
});

export const defaultAccountingEntry = (): AccountingEntryType => ({
	id: -1,
	account: null,
	accountNumber: 0,
	profitCenter: null,
	profitCenterName: '',
	projectNumber: 0,
	project: null,
	debetInCents: 0,
	kreditInCents: 0,
	voucherId: 0
});

export const defaultVoucher = (): VoucherType => ({
	id: -1,
	wares: [defaultWare()],
	accounting: [],
	privateVoucher: null,
	name: '',
	verNr: null,
	transactionDate: null,
	dateTurnedIn: toDate(),
	receiptUrl: '',
	utskott: '' as Utskott,
	receiptDate: toDate(),
	description: ''
});
