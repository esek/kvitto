class Routes {
	static readonly Home = '/';
	static readonly Vouchers = '/vouchers';
	static readonly ExpenseClaim = this.Vouchers + '/expenseclaim';
	static readonly ExpenseReport = this.Vouchers + '/expensereport';
	static readonly InternalInvoice = this.Vouchers + '/internalinvoice';
	static readonly SalesReport = this.Vouchers + '/salesreport';
	static readonly SupplierInvoice = this.Vouchers + '/supplierinvoice';
	static readonly DriversExpense = this.Vouchers + '/driversexpense';
	static readonly AccountingOrder = this.Vouchers + '/accountingorder';
	static readonly Admin = '/admin';
	static readonly AdminVouchers = this.Admin + '/vouchers';
	static readonly AdminAccounts = this.Admin + '/accounts';
	static readonly AdminProfitCenters = this.Admin + '/profitcenters';
	static readonly AdminProjects = this.Admin + '/projects';

	static AdminVouchersId(id: string) {
		return `/admin/vouchers/${id}`;
	}

	static confetti(route: string) {
		return `${route}?confetti`;
	}
}

export default Routes;
