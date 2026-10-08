import { error } from '@sveltejs/kit';
import { formatDate } from '@/helpers/date.helpers';
import type { FinancialYear } from './resultat';
import type { ReportFilters } from '@/models/resultat.models';

export function selectReportYear(years: FinancialYear[], value: string | null) {
	const today = formatDate();
	const year =
		value === null
			? (years.find((y) => y.FromDate <= today && y.ToDate >= today) ?? years[0])
			: years.find((y) => String(y.Id) === value);
	if (!year) error(400, 'Räkenskapsåret saknas i Fortnox.');
	return year;
}

export function reportFilters(query: URLSearchParams, year: FinancialYear): ReportFilters {
	const today = formatDate();
	const filters = {
		from: query.get('from') || year.FromDate,
		to: query.get('to') || (today >= year.FromDate && today <= year.ToDate ? today : year.ToDate),
		costCenter: query.get('costCenter') ?? '',
		project: query.get('project') ?? ''
	};
	for (const date of [filters.from, filters.to]) {
		if (
			!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
			!Number.isFinite(Date.parse(date)) ||
			new Date(date).toISOString().slice(0, 10) !== date ||
			date < year.FromDate ||
			date > year.ToDate
		)
			error(400, 'Välj giltiga datum inom räkenskapsåret.');
	}
	if (filters.from > filters.to) error(400, 'Från-datum måste vara före till-datum.');
	return filters;
}
