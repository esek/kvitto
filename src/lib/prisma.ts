import type {
	NewAccount,
	NewAccountingEntry,
	NewDriversExpense,
	NewExpenseClaim,
	NewExpenseReport,
	NewInternalInvoice,
	NewProfitCenter,
	NewProject,
	NewSalesReport,
	NewSupplierInvoice,
	NewVoucher,
	NewWare,
	UpdatedDriversExpense,
	UpdatedExpenseClaim,
	UpdatedExpenseReport,
	UpdatedInternalInvoice,
	UpdatedSalesReport,
	UpdatedSupplierInvoice,
	UpdatedVoucher,
	VoucherType
} from '@/models/voucher.models';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getVoucher = async (id: string): Promise<VoucherType | null> => {
	const voucher = await prisma.voucher.findUnique({
		where: { id },
		include: {
			accounting: { include: { profitCenter: true, project: true, account: true } },
			expenseClaim: { include: { wares: { include: { suggestedAccount: true } } } },
			expenseReport: { include: { wares: { include: { suggestedAccount: true } } } },
			internalInvoice: { include: { wares: { include: { suggestedAccount: true } } } },
			supplierInvoice: true,
			salesReport: { include: { wares: { include: { suggestedAccount: true } } } },
			driversExpense: true
		}
	});
	return voucher;
};

const createWares = async (newWares: NewWare[] | null): Promise<Prisma.WareCreateManyArgs> => {
	if (!newWares) {
		return { data: [] };
	}

	const wares: Prisma.WareCreateManyArgs = {
		data: newWares.map((w) => ({
			label: w.label,
			accountVoucherLabel: w.accountVoucherLabel,
			unitPriceInCents: w.unitPriceInCents,
			quantity: w.quantity
		}))
	};

	return wares;
};

const createAccountingOnVoucher = async (
	newAccounting: NewAccountingEntry[] | null
): Promise<Prisma.AccountingEntryCreateManyArgs> => {
	if (!newAccounting) {
		return { data: [] };
	}
	const accounting: Prisma.AccountingEntryCreateManyArgs = {
		data: newAccounting.map((a) => ({
			accountVoucherLabel: a.accountVoucherLabel,
			debetInCents: a.debetInCents,
			kreditInCents: a.kreditInCents,
			profitCenterName: a.profitCenterName,
			projectNumber: a.projectNumber
		}))
	};
	return accounting;
};

const createExpenseClaim = async (
	newExpenseClaim: NewExpenseClaim | null
): Promise<Prisma.ExpenseClaimCreateNestedOneWithoutVoucherInput> => {
	if (!newExpenseClaim) {
		return {};
	}

	const expenseClaim: Prisma.ExpenseClaimCreateNestedOneWithoutVoucherInput = {
		create: {
			name: newExpenseClaim.name,
			ssn: newExpenseClaim.ssn,
			clearingNum: newExpenseClaim.clearingNum,
			accountNum: newExpenseClaim.accountNum,
			receiptDate: newExpenseClaim.receiptDate,
			wares: {
				createMany: await createWares(newExpenseClaim.wares)
			}
		}
	};

	return expenseClaim;
};

const createExpenseReport = async (
	newExpenseReport: NewExpenseReport | null
): Promise<Prisma.ExpenseReportCreateNestedOneWithoutVoucherInput> => {
	if (!newExpenseReport) {
		return {};
	}

	const expenseReport: Prisma.ExpenseReportCreateNestedOneWithoutVoucherInput = {
		create: {
			name: newExpenseReport.name,
			receiptDate: newExpenseReport.receiptDate,
			wares: {
				createMany: await createWares(newExpenseReport.wares)
			}
		}
	};

	return expenseReport;
};

const createInternalInvoice = async (
	newInternalInvoice: NewInternalInvoice | null
): Promise<Prisma.InternalInvoiceCreateNestedOneWithoutVoucherInput> => {
	if (!newInternalInvoice) {
		return {};
	}

	const internalInvoice: Prisma.InternalInvoiceCreateNestedOneWithoutVoucherInput = {
		create: {
			senderName: newInternalInvoice.senderName,
			senderUtskott: newInternalInvoice.senderUtskott,
			recipientName: newInternalInvoice.recipientName,
			wares: {
				createMany: await createWares(newInternalInvoice.wares)
			}
		}
	};

	return internalInvoice;
};

const createSalesReport = async (
	newSalesReport: NewSalesReport | null
): Promise<Prisma.SalesReportCreateNestedOneWithoutVoucherInput> => {
	if (!newSalesReport) {
		return {};
	}
	const salesReport: Prisma.SalesReportCreateNestedOneWithoutVoucherInput = {
		create: {
			salesFeeInCents: newSalesReport.salesFeeInCents,
			totalSalesInCents: newSalesReport.totalSalesInCents,
			projectNumber: newSalesReport.projectNumber,
			wares: {
				createMany: await createWares(newSalesReport.wares)
			}
		}
	};
	return salesReport;
};

const createSupplierInvoice = async (
	newSupplierInvoice: NewSupplierInvoice | null
): Promise<Prisma.SupplierInvoiceCreateNestedOneWithoutVoucherInput> => {
	if (!newSupplierInvoice) {
		return {};
	}

	const supplierInvoice: Prisma.SupplierInvoiceCreateNestedOneWithoutVoucherInput = {
		create: {
			invoiceNumber: newSupplierInvoice.invoiceNumber,
			ocr: newSupplierInvoice.ocr,
			dueDate: newSupplierInvoice.dueDate,
			companyName: newSupplierInvoice.companyName
		}
	};

	return supplierInvoice;
};

const createDriversExpense = async (
	newDriversExpense: NewDriversExpense | null
): Promise<Prisma.DriversExpenseCreateNestedOneWithoutVoucherInput> => {
	if (!newDriversExpense) {
		return {};
	}

	const driversExpense: Prisma.DriversExpenseCreateNestedOneWithoutVoucherInput = {
		create: {
			name: newDriversExpense.name,
			ssn: newDriversExpense.ssn,
			destination: newDriversExpense.destination,
			clearingNum: newDriversExpense.clearingNum,
			accountNum: newDriversExpense.accountNum,
			miles: newDriversExpense.miles,
			ticketPriceInCents: newDriversExpense.ticketPriceInCents,
			milesCompensationInCents: 2500
		}
	};

	return driversExpense;
};

export const createVoucher = async (newVoucher: NewVoucher) => {
	const voucher = await prisma.voucher.create({
		data: {
			description: newVoucher.description,
			series: newVoucher.series,
			attachmentUrl: newVoucher.attachmentUrl,
			comment: newVoucher.comment,
			utskott: newVoucher.utskott,
			reference: newVoucher.reference,
			accounting: {
				createMany: await createAccountingOnVoucher(newVoucher.accounting)
			},
			expenseClaim: await createExpenseClaim(newVoucher.expenseClaim),
			expenseReport: await createExpenseReport(newVoucher.expenseReport),
			internalInvoice: await createInternalInvoice(newVoucher.internalInvoice),
			salesReport: await createSalesReport(newVoucher.salesReport),
			supplierInvoice: await createSupplierInvoice(newVoucher.supplierInvoice),
			driversExpense: await createDriversExpense(newVoucher.driversExpense)
		}
	});
	return voucher;
};

const updateExpenseClaim = async (
	updatedExpenseClaim: UpdatedExpenseClaim | null
): Promise<Prisma.ExpenseClaimUpdateOneWithoutVoucherNestedInput> => {
	if (!updatedExpenseClaim) {
		return {};
	}

	const expenseClaim: Prisma.ExpenseClaimUpdateOneWithoutVoucherNestedInput = {
		update: {
			name: updatedExpenseClaim.name,
			ssn: updatedExpenseClaim.ssn,
			clearingNum: updatedExpenseClaim.clearingNum,
			accountNum: updatedExpenseClaim.accountNum,
			receiptDate: updatedExpenseClaim.receiptDate,
			wares: {
				deleteMany: {},
				createMany: await createWares(updatedExpenseClaim.wares)
			}
		}
	};
	return expenseClaim;
};

const updateExpenseReport = async (
	updatedExpenseReport: UpdatedExpenseReport | null
): Promise<Prisma.ExpenseReportUpdateOneWithoutVoucherNestedInput> => {
	if (!updatedExpenseReport) {
		return {};
	}

	const expenseReport: Prisma.ExpenseReportUpdateOneWithoutVoucherNestedInput = {
		update: {
			name: updatedExpenseReport.name,
			receiptDate: updatedExpenseReport.receiptDate,
			wares: {
				deleteMany: {},
				createMany: await createWares(updatedExpenseReport.wares)
			}
		}
	};
	return expenseReport;
};

const updateInternalInvoice = async (
	updatedInternalInvoice: UpdatedInternalInvoice | null
): Promise<Prisma.InternalInvoiceUpdateOneWithoutVoucherNestedInput> => {
	if (!updatedInternalInvoice) {
		return {};
	}

	const internalInvoice: Prisma.InternalInvoiceUpdateOneWithoutVoucherNestedInput = {
		update: {
			senderName: updatedInternalInvoice.senderName,
			senderUtskott: updatedInternalInvoice.senderUtskott,
			recipientName: updatedInternalInvoice.recipientName,
			wares: {
				deleteMany: {},
				createMany: await createWares(updatedInternalInvoice.wares)
			}
		}
	};
	return internalInvoice;
};

const updateSalesReport = async (
	updatedSalesReport: UpdatedSalesReport | null
): Promise<Prisma.SalesReportUpdateOneWithoutVoucherNestedInput> => {
	if (!updatedSalesReport) {
		return {};
	}

	const salesReport: Prisma.SalesReportUpdateOneWithoutVoucherNestedInput = {
		update: {
			salesFeeInCents: updatedSalesReport.salesFeeInCents,
			totalSalesInCents: updatedSalesReport.totalSalesInCents,
			projectNumber: updatedSalesReport.projectNumber,
			wares: {
				deleteMany: {},
				createMany: await createWares(updatedSalesReport.wares)
			}
		}
	};
	return salesReport;
};

const updateSupplierInvoice = async (
	updatedSupplierInvoice: UpdatedSupplierInvoice | null
): Promise<Prisma.SupplierInvoiceUpdateOneWithoutVoucherNestedInput> => {
	if (!updatedSupplierInvoice) {
		return {};
	}

	const supplierInvoice: Prisma.SupplierInvoiceUpdateOneWithoutVoucherNestedInput = {
		update: {
			invoiceNumber: updatedSupplierInvoice.invoiceNumber,
			ocr: updatedSupplierInvoice.ocr,
			dueDate: updatedSupplierInvoice.dueDate,
			companyName: updatedSupplierInvoice.companyName
		}
	};
	return supplierInvoice;
};

const updateDriversExpense = async (
	updatedDriversExpense: UpdatedDriversExpense | null
): Promise<Prisma.DriversExpenseUpdateOneWithoutVoucherNestedInput> => {
	if (!updatedDriversExpense) {
		return {};
	}

	const driversExpense: Prisma.DriversExpenseUpdateOneWithoutVoucherNestedInput = {
		update: {
			name: updatedDriversExpense.name,
			ssn: updatedDriversExpense.ssn,
			destination: updatedDriversExpense.destination,
			clearingNum: updatedDriversExpense.clearingNum,
			accountNum: updatedDriversExpense.accountNum,
			miles: updatedDriversExpense.miles,
			ticketPriceInCents: updatedDriversExpense.ticketPriceInCents,
			milesCompensationInCents: updatedDriversExpense.milesCompensationInCents
		}
	};
	return driversExpense;
};

export const updateVoucher = async (updatedVoucher: UpdatedVoucher) => {
	const res = await prisma.voucher.update({
		where: { id: updatedVoucher.id },
		data: {
			id: updatedVoucher.id,
			description: updatedVoucher.description,
			series: updatedVoucher.series,
			label: updatedVoucher.label,
			accountedBy: updatedVoucher.accountedBy,
			approvedBy: updatedVoucher.approvedBy,
			comment: updatedVoucher.comment,
			utskott: updatedVoucher.utskott,
			reference: updatedVoucher.reference,
			transactionDate: updatedVoucher.transactionDate,
			accounting: {
				deleteMany: {},
				createMany: await createAccountingOnVoucher(updatedVoucher.accounting)
			},
			expenseClaim: await updateExpenseClaim(updatedVoucher.expenseClaim),
			expenseReport: await updateExpenseReport(updatedVoucher.expenseReport),
			internalInvoice: await updateInternalInvoice(updatedVoucher.internalInvoice),
			salesReport: await updateSalesReport(updatedVoucher.salesReport),
			supplierInvoice: await updateSupplierInvoice(updatedVoucher.supplierInvoice),
			driversExpense: await updateDriversExpense(updatedVoucher.driversExpense)
		}
	});
	return res;
};

export const deleteVoucher = async (id: string) => {
	try {
		return await prisma.voucher.delete({ where: { id } });
	} catch {
		return null;
	}
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
		where: { voucherLabel: newAccount.voucherLabel },
		create: {
			number: newAccount.number,
			voucherLabel: newAccount.voucherLabel,
			accountingLabel: newAccount.accountingLabel
		},
		update: { voucherLabel: newAccount.voucherLabel, accountingLabel: newAccount.accountingLabel }
	});
};

export const deleteAccount = async (voucherLabel: string) => {
	return await prisma.account.delete({
		where: { voucherLabel }
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

export const getProjects = async () => {
	return await prisma.project.findMany({ orderBy: { number: 'asc' } });
};
