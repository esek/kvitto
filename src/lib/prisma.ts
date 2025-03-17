import type {
	NewAccount,
	NewAccountingEntry,
	NewPrivateVoucher,
	NewPrivateVoucherMod,
	NewProfitCenter,
	NewProject,
	NewVoucher,
	NewVoucherMod,
	NewWare,
	PrivateVoucherType,
	VoucherType
} from '@/models/voucher.models';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getVoucher = async (id: number): Promise<VoucherType | null> => {
	const voucher = await prisma.voucher.findUnique({
		where: { id },
		include: { wares: true, accounting: { include: { profitCenter: true } } }
	});
	return voucher;
};

export const getPrivateVoucher = async (id: number): Promise<PrivateVoucherType | null> => {
	const voucher = await prisma.privateVoucher.findUnique({
		where: { id },
		include: {
			voucher: { include: { wares: true, accounting: { include: { profitCenter: true } } } }
		}
	});
	return voucher;
};

export const createVoucher = async (newVoucher: NewVoucher) => {
	const voucher = await prisma.voucher.create({
		data: {
			dateTurnedIn: newVoucher.dateTurnedIn,
			receiptUrl: newVoucher.receiptUrl,
			receiptDate: newVoucher.receiptDate,
			utskott: newVoucher.utskott,
			description: newVoucher.description,
			name: newVoucher.name,
			wares: {
				createMany: {
					data: newVoucher.wares
				}
			}
		}
	});
	return voucher;
};

export const createPrivateVoucher = async (newPrivateVoucher: NewPrivateVoucher) => {
	const privateVoucher = await prisma.privateVoucher.create({
		data: {
			ssn: newPrivateVoucher.ssn,
			accountNum: newPrivateVoucher.accountNum,
			clearingNum: newPrivateVoucher.clearingNum,
			voucher: {
				create: {
					dateTurnedIn: newPrivateVoucher.voucher.dateTurnedIn,
					receiptUrl: newPrivateVoucher.voucher.receiptUrl,
					receiptDate: newPrivateVoucher.voucher.receiptDate,
					utskott: newPrivateVoucher.voucher.utskott,
					description: newPrivateVoucher.voucher.description,
					name: newPrivateVoucher.voucher.name,
					wares: {
						createMany: {
							data: newPrivateVoucher.voucher.wares
						}
					}
				}
			}
		}
	});
	return privateVoucher;
};

const assignVoucherIds = async <T>(voucherId: number, wares: T[]) => {
	return wares.map((w) => ({ voucherId, ...w }));
};

export const updateVoucher = async (newVoucherMod: NewVoucherMod) => {
	const { id, wares, accounting, ...voucherMods } = newVoucherMod;
	const waresWithId = await assignVoucherIds(id, wares);
	const accountingWithId = await assignVoucherIds(id, accounting);
	const res = await prisma.$transaction([
		prisma.ware.deleteMany({
			where: { voucherId: id }
		}),
		prisma.ware.createMany({
			data: waresWithId
		}),
		prisma.accountingEntry.deleteMany({
			where: { voucherId: id }
		}),
		prisma.accountingEntry.createMany({
			data: accountingWithId
		}),
		prisma.voucher.update({
			where: { id },
			data: voucherMods
		})
	]);
	return res;
};

export const updatePrivateVoucher = async (newPrivateVoucherMod: NewPrivateVoucherMod) => {
	const { voucher, ...privateMods } = newPrivateVoucherMod;
	const { id, wares, accounting, ...voucherMods } = voucher;
	const waresWithId = await assignVoucherIds(id, wares);
	const accountingWithId = await assignVoucherIds(id, accounting);
	const res = await prisma.$transaction([
		prisma.ware.deleteMany({
			where: { voucherId: id }
		}),
		prisma.ware.createMany({
			data: waresWithId
		}),
		prisma.accountingEntry.deleteMany({
			where: { voucherId: id }
		}),
		prisma.accountingEntry.createMany({
			data: accountingWithId
		}),
		prisma.privateVoucher.update({
			where: { id },
			data: {
				voucher: {
					update: {
						data: voucherMods
					}
				},
				...privateMods
			}
		})
	]);
	return res;
};

export const getAccounts = async () => {
	return await prisma.account.findMany({
		orderBy: {
			number: 'asc'
		}
	});
};

export const createAccount = async (newAccount: NewAccount) => {
	return await prisma.account.upsert({
		where: { number: newAccount.number },
		create: {
			number: newAccount.number,
			voucherLabel: newAccount.voucherLabel,
			accountingLabel: newAccount.accountingLabel
		},
		update: { voucherLabel: newAccount.voucherLabel, accountingLabel: newAccount.accountingLabel }
	});
};

export const deleteAccount = async (number: number) => {
	return await prisma.account.delete({
		where: { number }
	});
};

export const getProfitCenters = async () => {
	return await prisma.profitCenter.findMany({
		orderBy: {
			utskott: 'asc'
		}
	});
};

export const createProfitCenter = async (newProfitCenter: NewProfitCenter) => {
	return await prisma.profitCenter.upsert({
		where: { name: newProfitCenter.name },
		create: { name: newProfitCenter.name, utskott: newProfitCenter.utskott },
		update: { utskott: newProfitCenter.utskott }
	});
};

export const deleteProfitCenter = async (name: string) => {
	return await prisma.profitCenter.delete({ where: { name } });
};

export const createProject = async (newProject: NewProject) => {
	return await prisma.project.upsert({
		where: { number: newProject.number },
		create: { name: newProject.name, number: newProject.number },
		update: { name: newProject.name }
	});
};

export const deleteProject = async (number: number) => {
	return await prisma.project.delete({ where: { number } });
};

export const createAccounting = async (voucherId: number, newAccounting: NewAccountingEntry[]) => {
	const accounting = newAccounting.map((a) => ({ ...a, voucherId }));
	const count = await prisma.accountingEntry.createMany({
		data: accounting
	});
	return count;
};

export const getProjects = async () => {
	return await prisma.project.findMany({ orderBy: { number: 'asc' } });
};
