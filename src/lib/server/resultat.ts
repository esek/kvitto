import { z } from 'zod';
import type { ReportProgress } from '@/models/resultat.models';
import type { getFortnoxApiClient } from '$lib/fortnox';

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const yearSchema = z.object({
	Id: z.coerce.number().int().positive(),
	FromDate: date,
	ToDate: date
});
const rowSchema = z.object({
	Account: z.coerce.number().int().min(1000).max(9999),
	Debit: z.union([z.number(), z.string()]),
	Credit: z.union([z.number(), z.string()]),
	CostCenter: z.string().nullish(),
	Project: z.string().nullish(),
	Description: z.string().optional(),
	Removed: z.union([z.boolean(), z.enum(['true', 'false'])]).optional()
});
const voucherSchema = z.object({
	VoucherNumber: z.coerce.number().int().nonnegative(),
	VoucherSeries: z.string().min(1),
	Year: z.coerce.number().int().positive(),
	TransactionDate: date,
	VoucherRows: z.array(rowSchema).optional()
});
const pagination = z.object({
	'@TotalPages': z.coerce.number().int().min(0),
	'@CurrentPage': z.coerce.number().int().positive(),
	'@TotalResources': z.coerce.number().int().nonnegative().optional()
});
export type FinancialYear = z.infer<typeof yearSchema>;
const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Share request-start pacing across report loads in this process. Parallel workers
// overlap network latency, but must not turn into a burst above 25 starts / 5 s.
let startQueue = Promise.resolve();
let nextStart = 0;
let blockedUntil = 0;
function waitForRequestSlot() {
	const slot = startQueue.then(async () => {
		let delay: number;
		while ((delay = Math.max(nextStart, blockedUntil) - Date.now()) > 0) await pause(delay);
		nextStart = Date.now() + 225;
	});
	startQueue = slot.catch(() => {});
	return slot;
}

async function parallelMap<T, R>(
	items: T[],
	concurrency: number,
	map: (item: T) => Promise<R>
): Promise<R[]> {
	const results: R[] = new Array(items.length);
	let next = 0;
	let failed = false;
	const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
		try {
			while (!failed && next < items.length) {
				const index = next++;
				results[index] = await map(items[index]!);
			}
		} catch (cause) {
			failed = true;
			throw cause;
		}
	});
	// Drain already-running workers before reporting failure; no partial report.
	const outcomes = await Promise.allSettled(workers);
	for (const outcome of outcomes) if (outcome.status === 'rejected') throw outcome.reason;
	return results;
}

export class FortnoxReportError extends Error {
	readonly status: number;
	constructor(message: string, status: number) {
		super(message);
		this.status = status;
		this.name = 'FortnoxReportError';
	}
}

export function reportClient(
	api: ReturnType<typeof getFortnoxApiClient>,
	onProgress: (progress: ReportProgress) => void = () => {}
) {
	async function request(
		operation: () => Promise<{ data?: unknown; error?: unknown; response: Response }>
	): Promise<unknown> {
		for (let attempt = 0; attempt < 4; attempt++) {
			await waitForRequestSlot();
			const { data, error: apiError, response } = await operation();
			if (response.ok && data) return data;
			if (response.status === 429 && attempt < 3) {
				const retry = response.headers.get('retry-after');
				const seconds = retry ? Number(retry) : NaN;
				const delay = Number.isFinite(seconds)
					? seconds * 1000
					: retry
						? Date.parse(retry) - Date.now()
						: 5000;
				const wait = Math.max(1000, Math.min(Number.isFinite(delay) ? delay : 5000, 60000));
				blockedUntil = Math.max(blockedUntil, Date.now() + wait);
				continue;
			}
			// Keep the useful API error, but never log request headers, tokens or voucher bodies.
			const details = z
				.object({
					ErrorInformation: z.object({
						Code: z.union([z.string(), z.number()]).optional(),
						Message: z.string().optional(),
						code: z.union([z.string(), z.number()]).optional(),
						message: z.string().optional()
					})
				})
				.safeParse(apiError);
			const url = response.url ? new URL(response.url) : undefined;
			const query = new URLSearchParams();
			for (const key of ['financialyear', 'limit', 'page']) {
				const value = url?.searchParams.get(key);
				if (value !== null && value !== undefined) query.set(key, value);
			}
			const endpoint = url ? `${url.pathname}${query.size ? `?${query}` : ''}` : 'okänd endpoint';
			const info = details.success ? details.data.ErrorInformation : undefined;
			const code = info?.code ?? info?.Code;
			const message = info?.message ?? info?.Message;
			throw new FortnoxReportError(
				`Fortnox ${endpoint} (HTTP ${response.status}): ${code ?? 'okänd felkod'} ${message || 'Inget felmeddelande från Fortnox'}`,
				response.status
			);
		}
		throw new Error('Fortnox kunde inte hämtas.');
	}
	return {
		async years() {
			const years: FinancialYear[] = [];
			for (let page = 1; ; page++) {
				const data = z
					.object({ FinancialYears: z.array(yearSchema), MetaInformation: pagination })
					.parse(
						await request(() =>
							api.GET('/3/financialyears', { params: { query: { limit: 500, page } } as {} })
						)
					);
				if (data.MetaInformation['@CurrentPage'] !== page)
					throw new Error('Felaktig paginering från Fortnox');
				years.push(...data.FinancialYears);
				if (page >= data.MetaInformation['@TotalPages']) break;
			}
			return years.sort((a, b) => b.FromDate.localeCompare(a.FromDate));
		},
		async vouchers(year: FinancialYear) {
			onProgress({ phase: 'listing', fetched: 0, total: null, listed: 0 });
			const listed: z.infer<typeof voucherSchema>[] = [];
			const seen = new Set<string>();
			let expectedTotal: number | undefined;
			let expectedPages: number | undefined;
			for (let page = 1; ; page++) {
				const data = z
					.object({ Vouchers: z.array(voucherSchema), MetaInformation: pagination })
					.parse(
						await request(() =>
							api.GET('/3/vouchers', {
								params: { query: { financialyear: year.Id, limit: 500, page } } as {}
							})
						)
					);
				const meta = data.MetaInformation;
				if (meta['@CurrentPage'] !== page) throw new Error('Felaktig paginering från Fortnox');
				if (expectedPages !== undefined && expectedPages !== meta['@TotalPages'])
					throw new Error('Antalet verifikatsidor ändrades under hämtningen. Försök igen.');
				expectedPages = meta['@TotalPages'];
				if (meta['@TotalResources'] !== undefined) {
					if (expectedTotal !== undefined && expectedTotal !== meta['@TotalResources'])
						throw new Error('Antalet verifikat ändrades under hämtningen. Försök igen.');
					expectedTotal = meta['@TotalResources'];
				}
				for (const voucher of data.Vouchers) {
					const key = `${voucher.Year}/${voucher.VoucherSeries}/${voucher.VoucherNumber}`;
					if (seen.has(key)) throw new Error('Verifikatlistan innehåller dubbletter. Försök igen.');
					seen.add(key);
					listed.push(voucher);
				}
				onProgress({
					phase: 'listing',
					fetched: 0,
					total: expectedTotal ?? null,
					listed: listed.length
				});
				if (page >= expectedPages) break;
			}
			if (expectedTotal !== undefined && listed.length !== expectedTotal)
				throw new Error(
					`Ofullständig verifikatlista: hämtade ${listed.length}, Fortnox anger ${expectedTotal}.`
				);
			onProgress({ phase: 'vouchers', fetched: 0, total: listed.length, listed: listed.length });
			let completed = 0;
			const vouchers = await parallelMap(listed, 5, async (entry) => {
				let voucher = entry;
				if (!voucher.VoucherRows?.length) {
					const detail = z
						.object({ Voucher: voucherSchema.extend({ VoucherRows: z.array(rowSchema) }) })
						.parse(
							await request(() =>
								api.GET('/3/vouchers/{VoucherSeries}/{VoucherNumber}', {
									params: {
										path: {
											VoucherSeries: voucher.VoucherSeries,
											VoucherNumber: voucher.VoucherNumber
										},
										query: { financialyear: year.Id }
									}
								})
							)
						);
					if (
						detail.Voucher.VoucherSeries !== voucher.VoucherSeries ||
						detail.Voucher.VoucherNumber !== voucher.VoucherNumber
					)
						throw new Error('Fel verifikat från Fortnox');
					voucher = detail.Voucher;
				}
				if (
					voucher.Year !== year.Id ||
					voucher.TransactionDate < year.FromDate ||
					voucher.TransactionDate > year.ToDate
				)
					throw new Error('Fel räkenskapsår från Fortnox');
				completed++;
				onProgress({
					phase: 'vouchers',
					fetched: completed,
					total: listed.length,
					listed: listed.length
				});
				return { ...voucher, VoucherRows: voucher.VoucherRows! };
			});
			onProgress({
				phase: 'complete',
				fetched: vouchers.length,
				total: vouchers.length,
				listed: vouchers.length
			});
			return vouchers;
		}
	};
}
