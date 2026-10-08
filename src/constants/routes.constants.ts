class Routes {
	static readonly Home = '/';
	static readonly Resultat = '/resultat';
	static readonly Vouchers = '/vouchers';
	static readonly ExpenseClaim = this.Vouchers + '/expenseclaim';
	static readonly ExpenseReport = this.Vouchers + '/expensereport';
	static readonly InternalInvoice = this.Vouchers + '/internalinvoice';
	static readonly SalesReport = this.Vouchers + '/salesreport';
	static readonly SupplierInvoice = this.Vouchers + '/supplierinvoice';
	static readonly DriversExpense = this.Vouchers + '/driversexpense';
	static readonly AccountingOrder = this.Vouchers + '/accountingorder';
	static readonly LedReport = this.Vouchers + '/ledreport';
	static readonly Admin = '/admin';
	static readonly AdminVouchers = this.Admin + '/vouchers';
	static readonly AdminVoucherArchive = this.AdminVouchers + '/archive';
	static readonly AdminAccounts = this.Admin + '/accounts';
	static readonly AdminProfitCenters = this.Admin + '/profitcenters';
	static readonly AdminProjects = this.Admin + '/projects';
	static readonly AdminInfo = this.Admin + '/info';

	static readonly Fortnox = this.Admin + '/fortnox';
	static readonly FortnoxLogin = this.Fortnox + '/login';
	static readonly FortnoxRefresh = this.Fortnox + '/refresh';
	static readonly FortnoxCallback = this.Fortnox + '/callback';
	static readonly FortnoxVouchers = this.Fortnox + '/vouchers';
	static readonly FortnoxAccounts = this.Fortnox + '/accounts';
	static readonly FortnoxProjects = this.Fortnox + '/projects';
	static readonly FortnoxProfitCenters = this.Fortnox + '/profitcenters';
	static readonly FortnoxSuppliers = this.Fortnox + '/suppliers';

	static AdminVouchersId(id: string) {
		return this.AdminVouchers + '/' + id;
	}

	static FortnoxVouchersId(id: string) {
		return this.FortnoxVouchers + '/' + id;
	}
}

export default Routes;
