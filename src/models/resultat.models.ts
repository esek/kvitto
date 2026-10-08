import type { aggregateResultat } from '@/helpers/resultat.helpers';

export type ReportProgress = {
	phase: 'listing' | 'vouchers' | 'complete';
	fetched: number;
	total: number | null;
	listed: number;
};
export type ReportFilters = { from: string; to: string; costCenter: string; project: string };
export type ReportResult = {
	report: ReturnType<typeof aggregateResultat>;
	filters: ReportFilters;
	fetchedAt: string;
	expiresAt: string;
	cached: boolean;
	projects: { value: string; label: string }[];
	costCenters: string[];
};
export type ReportEvent =
	| { type: 'progress'; progress: ReportProgress }
	| { type: 'result'; result: ReportResult }
	| { type: 'error'; message: string }
	| { type: 'setup' };
