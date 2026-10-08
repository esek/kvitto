import type { ReportVoucher } from '@/helpers/resultat.helpers';
import type { ReportProgress } from '@/models/resultat.models';
import type { FinancialYear } from './resultat';

export const voucherCacheKey = (sessionId: string, year: FinancialYear) =>
	JSON.stringify([sessionId, year.Id, year.FromDate, year.ToDate]);

export const VOUCHER_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
type Snapshot = { vouchers: ReportVoucher[]; fetchedAt: number; expiresAt: number };
type Listener = (progress: ReportProgress) => void;
type Pending = { promise: Promise<Snapshot>; listeners: Set<Listener>; progress: ReportProgress };

export function createVoucherCache(now: () => number = Date.now) {
	const entries = new Map<string, Snapshot>();
	const pending = new Map<string, Pending>();
	return {
		async get(
			key: string,
			load: (progress: Listener) => Promise<ReportVoucher[]>,
			onProgress: Listener,
			options: { refresh?: boolean } = {}
		) {
			for (const [id, entry] of entries) if (entry.expiresAt <= now()) entries.delete(id);
			const cached = entries.get(key);
			// Refresh in the background without deleting the previous complete snapshot.
			// Normal reads can still use it; concurrent refreshes share the pending job.
			if (cached && !options.refresh) {
				onProgress({
					phase: 'complete',
					fetched: cached.vouchers.length,
					total: cached.vouchers.length,
					listed: cached.vouchers.length
				});
				return { ...cached, cached: true };
			}
			let job = pending.get(key);
			if (!job) {
				const next: Omit<Pending, 'promise'> = {
					listeners: new Set(),
					progress: { phase: 'listing', fetched: 0, total: null, listed: 0 }
				};
				// Defer starting until the first subscriber has been registered.
				const promise = Promise.resolve()
					.then(async () => {
						const vouchers = await load((progress) => {
							next.progress = progress;
							for (const listener of next.listeners) listener(progress);
						});
						const fetchedAt = now();
						const snapshot = { vouchers, fetchedAt, expiresAt: fetchedAt + VOUCHER_CACHE_TTL };
						entries.set(key, snapshot);
						return snapshot;
					})
					.finally(() => pending.delete(key));
				job = Object.assign(next, { promise });
				pending.set(key, job);
			}
			job.listeners.add(onProgress);
			onProgress(job.progress);
			try {
				return { ...(await job.promise), cached: false };
			} finally {
				job.listeners.delete(onProgress);
			}
		}
	};
}

// Connection/session identity prevents one Fortnox connection reading another's cache.
export const voucherCache = createVoucherCache();
