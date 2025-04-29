import type {
	NewAccount,
	NewAccountingEntry,
	NewProfitCenter,
	NewProject,
	NewVoucher,
	UpdatedVoucher,
	VoucherType
} from '@/models/voucher.models';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getVoucher = async (id: number): Promise<VoucherType | null> => {
	const voucher = await prisma.voucher.findUnique({
		where: { id },
		include: {
			wares: { include: { suggestedAccount: true } },
			accounting: { include: { profitCenter: true, project: true, account: true } },
			privateVoucher: true
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
					data: newVoucher.wares.map((w) => ({
						label: w.label,
						costInCents: w.costInCents,
						accountNumber: w.accountNumber
					}))
				}
			},
			privateVoucher: newVoucher.privateVoucher
				? {
						create: {
							ssn: newVoucher.privateVoucher.ssn,
							clearingNum: newVoucher.privateVoucher.clearingNum,
							accountNum: newVoucher.privateVoucher.accountNum
						}
					}
				: {}
		}
	});
	return voucher;
};

export const updateVoucher = async (updatedVoucher: UpdatedVoucher) => {
	const { id, wares, accounting, privateVoucher, ...voucherMods } = updatedVoucher;
	const res = await prisma.$transaction(
		[
			prisma.ware.deleteMany({ where: { id: { notIn: wares.map((w) => w.id) }, voucherId: id } }),
			wares.map((w) =>
				prisma.ware.upsert({
					where: { id: w.id },
					create: {
						voucherId: id,
						label: w.label,
						accountNumber: w.accountNumber,
						costInCents: w.costInCents
					},
					update: {
						label: w.label,
						accountNumber: w.accountNumber,
						costInCents: w.costInCents
					}
				})
			),
			prisma.accountingEntry.deleteMany({
				where: { id: { notIn: accounting.map((a) => a.id) }, voucherId: id }
			}),
			accounting.map((a) =>
				prisma.accountingEntry.upsert({
					where: { id: a.id },
					create: {
						voucherId: id,
						accountNumber: a.accountNumber,
						debetInCents: a.debetInCents,
						kreditInCents: a.kreditInCents,
						profitCenterName: a.profitCenterName,
						projectNumber: a.projectNumber
					},
					update: {
						accountNumber: a.accountNumber,
						debetInCents: a.debetInCents,
						kreditInCents: a.kreditInCents,
						profitCenterName: a.profitCenterName,
						projectNumber: a.projectNumber
					}
				})
			),
			prisma.voucher.update({
				where: { id },
				data: {
					name: voucherMods.name,
					description: voucherMods.description,
					receiptDate: voucherMods.receiptDate,
					utskott: voucherMods.utskott
				}
			}),
			privateVoucher
				? prisma.privateVoucher.update({
						where: { id },
						data: {
							ssn: privateVoucher.ssn,
							accountNum: privateVoucher.accountNum,
							clearingNum: privateVoucher.clearingNum
						}
					})
				: []
		].flat()
	);
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

export const createProject = async (project: NewProject) => {
	return await prisma.project.upsert({
		where: { number: project.number },
		create: { name: project.name, number: project.number },
		update: { name: project.name }
	});
};

export const deleteProject = async (number: number) => {
	return await prisma.project.delete({ where: { number } });
};

export const createAccounting = async (accounting: NewAccountingEntry[]) => {
	const count = await prisma.accountingEntry.createMany({
		data: accounting.map((a) => ({
			voucherId: a.voucherId,
			debetInCents: a.debetInCents,
			kreditInCents: a.kreditInCents,
			profitCenterName: a.profitCenterName,
			projectNumber: a.projectNumber,
			accountNumber: a.accountNumber
		}))
	});
	return count;
};

export const getProjects = async () => {
	return await prisma.project.findMany({ orderBy: { number: 'asc' } });
};
