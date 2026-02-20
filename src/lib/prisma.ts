import type {
	NewAccountingEntry,
	NewDriversExpense,
	NewExpenseClaim,
	NewExpenseReport,
	NewInternalInvoice,
	NewSalesReport,
	NewSupplierInvoice,
	NewVoucher,
	NewWare,
	UpdatedAccount,
	UpdatedDriversExpense,
	UpdatedExpenseClaim,
	UpdatedExpenseReport,
	UpdatedInternalInvoice,
	UpdatedProfitCenter,
	UpdatedProject,
	UpdatedSalesReport,
	UpdatedSupplierInvoice,
	UpdatedVoucher,
	VoucherFortnoxType,
	VoucherType
} from '@/models/voucher.models';
import { Prisma, PrismaClient, Utskott } from '@prisma/client';

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
export const getVoucherWithFortnoxIdents = async (id: string): Promise<VoucherType & { ident: VoucherFortnoxType | null } | null> => {
	const voucher = await prisma.voucher.findUnique({
		where: { id },
		include: {
			accounting: { include: { profitCenter: true, project: true, account: true } },
			expenseClaim: { include: { wares: { include: { suggestedAccount: true } } } },
			expenseReport: { include: { wares: { include: { suggestedAccount: true } } } },
			internalInvoice: { include: { wares: { include: { suggestedAccount: true } } } },
			supplierInvoice: true,
			salesReport: { include: { wares: { include: { suggestedAccount: true } } } },
			driversExpense: true,
            ident: true,
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
			accountNumber: w.accountNumber,
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
			accountNumber: a.accountNumber,
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
			companyName: newSupplierInvoice.companyName,
			companyNumber: newSupplierInvoice.companyNumber
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
			label: newVoucher.label,
			series: newVoucher.series,
			attachmentUrl: newVoucher.attachmentUrl,
			comment: newVoucher.comment,
			utskott: newVoucher.utskott,
			transactionDate: newVoucher.transactionDate,
			reference: newVoucher.reference,
			referenceEmail: newVoucher.referenceEmail,
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
			paymentAddedBy: updatedExpenseClaim.paymentAddedBy,
			paymentDate: updatedExpenseClaim.paymentDate,
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
			companyName: updatedSupplierInvoice.companyName,
			companyNumber: updatedSupplierInvoice.companyNumber
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
			milesCompensationInCents: updatedDriversExpense.milesCompensationInCents,
			paymentAddedBy: updatedDriversExpense.paymentAddedBy,
			paymentDate: updatedDriversExpense.paymentDate
		}
	};
	return driversExpense;
};

export const updateVoucher = async (updatedVoucher: UpdatedVoucher) => {
	const existingVoucher = await prisma.voucher.findUnique({
		where: { id: updatedVoucher.id },
		select: { accounted: true }
	});
	if (existingVoucher?.accounted) {
		throw new Error('Cannot update an accounted voucher');
	}

	const res = await prisma.voucher.update({
		where: { id: updatedVoucher.id },
		data: {
			id: updatedVoucher.id,
			description: updatedVoucher.description,
			series: updatedVoucher.series,
			label: updatedVoucher.label,
			accountedBy: updatedVoucher.accountedBy,
			approvedBy: updatedVoucher.approvedBy,
			approvedAt: updatedVoucher.approvedAt,
			comment: updatedVoucher.comment,
			utskott: updatedVoucher.utskott,
			reference: updatedVoucher.reference,
			transactionDate: updatedVoucher.transactionDate,
			paid: updatedVoucher.paid,
			archived: updatedVoucher.archived,
			accounted: updatedVoucher.accounted,
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

export const markVoucherAsAccounted = async (id: string) => {
	const res = await prisma.voucher.update({ where: { id: id }, data: { accounted: true } });
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

export const updateAccount = async (updatedAccount: UpdatedAccount) => {
	return await prisma.account.update({
		where: { number: updatedAccount.number },
		data: { voucherLabel: updatedAccount.voucherLabel }
	});
};

export const getProfitCenters = async () => {
	return await prisma.profitCenter.findMany({
		orderBy: {
			name: 'asc'
		}
	});
};

export const updateProfitCenter = async (updatedProfitCenter: UpdatedProfitCenter) => {
	return await prisma.profitCenter.update({
		where: { name: updatedProfitCenter.name },
		data: { utskott: updatedProfitCenter.utskott }
	});
};

export const getProjects = async () => {
	return await prisma.project.findMany({ orderBy: { number: 'asc' } });
};

export const updateProject = async (updatedProject: UpdatedProject) => {
	return await prisma.project.update({
		where: { number: updatedProject.number },
		data: { name: updatedProject.name }
	});
};

export const getSuppliers = async () => {
	return await prisma.supplier.findMany({ orderBy: { name: 'asc' } });
};

export const getTurnedInVouchers = async (utskott?: Utskott) => {
	const vouchers = await prisma.voucher.findMany({
		where: { utskott, AND: [{ accounted: false }, { archived: false }] },
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

	return vouchers;
};

export const getArchivedVouchers = async () => {
	const lastYear = new Date()
	lastYear.setUTCFullYear(lastYear.getUTCFullYear() - 1)
	lastYear.setUTCDate(1)
	lastYear.setUTCMonth(0)
	lastYear.setUTCHours(0, 0, 0, 0)

	const vouchers = await prisma.voucher.findMany({
		where: {
			AND: [
				{ OR: [{ accounted: true }, { archived: true }] },
				{ OR: [{ transactionDate: null }, { transactionDate: { gt: lastYear } }] }
			]
		},
		include: {
			accounting: { include: { profitCenter: true, project: true, account: true } },
			expenseClaim: { include: { wares: { include: { suggestedAccount: true } } } },
			expenseReport: { include: { wares: { include: { suggestedAccount: true } } } },
			internalInvoice: { include: { wares: { include: { suggestedAccount: true } } } },
			supplierInvoice: true,
			salesReport: { include: { wares: { include: { suggestedAccount: true } } } },
			driversExpense: true
		},
        orderBy: [{ transactionDate: "desc" }, { approvedAt: "desc" }, { dateTurnedIn: "desc" }],
	});

	return vouchers;
};

export const setVoucherFortnoxIdent = async (id: string, number: number, series: string, fiscalYear: number, url: string) => {
	return await prisma.voucherFortnoxIdentifier.create({ data: {
        number,
        series,
        fiscalYear,
        url,
        voucher: { connect: { id } },
    } })
}
