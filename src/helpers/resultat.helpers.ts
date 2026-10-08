export type ReportRow = {
	Account: number;
	Debit: number | string;
	Credit: number | string;
	CostCenter?: string | null;
	Project?: string | null;
	Description?: string;
	Removed?: boolean | 'true' | 'false';
};
export type ReportVoucher = { TransactionDate: string; VoucherRows: ReportRow[] };
export const dimensionCode = (value: string | null | undefined) => value?.trim() || '';

// Parse decimals without introducing binary floating-point rounding errors.
export const amountInCents = (value: number | string): number => {
	const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(String(value));
	if (!match) throw new Error('Ogiltigt belopp från Fortnox');
	const cents =
		(Number(match[2]) * 100 + Number((match[3] ?? '').padEnd(2, '0'))) * (match[1] ? -1 : 1);
	if (!Number.isSafeInteger(cents)) throw new Error('Beloppet är för stort');
	return cents;
};
export function aggregateResultat(
	vouchers: ReportVoucher[],
	filters: { from: string; to: string; costCenter: string; project: string },
	accounts: { number: number; accountingLabel: string }[]
) {
	const labels = new Map(accounts.map((a) => [a.number, a.accountingLabel]));
	const totals = new Map<
		number,
		{ account: number; label: string; period: number; accumulated: number; income: boolean }
	>();
	const matches = (value: string | null | undefined, filter: string) =>
		filter === '' || dimensionCode(value) === (filter === '__none__' ? '' : filter);
	for (const voucher of vouchers) {
		if (voucher.TransactionDate > filters.to) continue;
		for (const row of voucher.VoucherRows) {
			if (row.Removed === true || row.Removed === 'true') continue;
			// BAS result accounts. 8999 transfers the result at year-end; it is not an expense.
			if (row.Account < 3000 || row.Account >= 9000 || row.Account === 8999) continue;
			if (!matches(row.CostCenter, filters.costCenter) || !matches(row.Project, filters.project))
				continue;
			const income = row.Account < 4000 || (row.Account >= 8000 && row.Account < 8400);
			const amount = (amountInCents(row.Credit) - amountInCents(row.Debit)) * (income ? 1 : -1);
			const total = totals.get(row.Account) ?? {
				account: row.Account,
				label: labels.get(row.Account) || row.Description || String(row.Account),
				period: 0,
				accumulated: 0,
				income
			};
			total.accumulated += amount;
			if (voucher.TransactionDate >= filters.from) total.period += amount;
			if (!Number.isSafeInteger(total.period) || !Number.isSafeInteger(total.accumulated))
				throw new Error('Summan är för stor');
			totals.set(row.Account, total);
		}
	}
	const rows = [...totals.values()].sort((a, b) => a.account - b.account);
	const sum = (income: boolean, key: 'period' | 'accumulated') =>
		rows.filter((r) => r.income === income).reduce((n, r) => n + r[key], 0);
	return {
		rows,
		income: sum(true, 'period'),
		costs: sum(false, 'period'),
		result: sum(true, 'period') - sum(false, 'period'),
		accumulatedResult: sum(true, 'accumulated') - sum(false, 'accumulated')
	};
}

export function reportOptions(
	projects: { number: number; name: string }[],
	costCenters: { name: string }[],
	vouchers: ReportVoucher[] = []
) {
	const projectOptions = new Map(projects.map((p) => [String(p.number), p.name]));
	const costCenterOptions = new Set(costCenters.map((c) => c.name));
	for (const voucher of vouchers)
		for (const row of voucher.VoucherRows) {
			const project = dimensionCode(row.Project);
			const costCenter = dimensionCode(row.CostCenter);
			if (project && !projectOptions.has(project)) projectOptions.set(project, project);
			if (costCenter) costCenterOptions.add(costCenter);
		}
	return {
		projects: [...projectOptions]
			.map(([value, label]) => ({ value, label }))
			.sort((a, b) => a.value.localeCompare(b.value, 'sv', { numeric: true })),
		costCenters: [...costCenterOptions].sort((a, b) => a.localeCompare(b, 'sv'))
	};
}
