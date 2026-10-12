import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireResultatUser } from '$lib/server/resultat-auth';
import { getResultatConnection } from '$lib/server/resultat-connection';
import { reportClient, FortnoxReportError } from '$lib/server/resultat';
import { getAccounts, getProfitCenters, getProjects, getVoucherDescriptions } from '$lib/prisma';
import { aggregateResultat, reportOptions } from '@/helpers/resultat.helpers';
import { reportFilters, selectReportYear } from '$lib/server/resultat-filters';
import { voucherCache, voucherCacheKey } from '$lib/server/resultat-cache';
import type { ReportEvent } from '@/models/resultat.models';

export const POST: RequestHandler = async (event) => {
	await requireResultatUser(event);
	if (event.request.headers.get('origin') !== event.url.origin) error(403, 'Ogiltigt ursprung.');
	const headers = { 'cache-control': 'private, no-store', 'x-accel-buffering': 'no' };
	const connection = await getResultatConnection();
	if (!connection) return json({ type: 'setup' }, { headers });
	const client = reportClient(connection.api);
	let years;
	try {
		years = await client.years();
	} catch (cause) {
		console.error('[resultat] Kunde inte hämta räkenskapsår:', cause);
		if (cause instanceof FortnoxReportError && [401, 403].includes(cause.status))
			return json({ type: 'setup' }, { headers });
		error(502, 'Kunde inte hämta räkenskapsår från Fortnox.');
	}
	const year = selectReportYear(years, event.url.searchParams.get('year'));
	const filters = reportFilters(event.url.searchParams, year);
	const key = voucherCacheKey(connection.id, year);
	const refresh = event.url.searchParams.get('refresh') === '1';
	const encoder = new TextEncoder();
	let closed = false;
	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			const send = (message: ReportEvent) => {
				if (!closed) controller.enqueue(encoder.encode(JSON.stringify(message) + '\n'));
			};
			void (async () => {
				try {
					const snapshot = await voucherCache.get(
						key,
						(progress) => reportClient(connection.api, progress).vouchers(year),
						(progress) => send({ type: 'progress', progress }),
						{ refresh }
					);
					const [accounts, projects, costCenters] = await Promise.all([
						getAccounts(),
						getProjects(),
						getProfitCenters()
					]);
					const voucherKeys = snapshot.vouchers.map((v) => ({
						series: v.VoucherSeries,
						number: v.VoucherNumber
					}));
					const voucherDescriptions = await getVoucherDescriptions(year.Id, voucherKeys);
					send({
						type: 'result',
						result: {
							report: aggregateResultat(
								snapshot.vouchers,
								filters,
								accounts,
								projects,
								voucherDescriptions
							),
							filters,
							fetchedAt: new Date(snapshot.fetchedAt).toISOString(),
							expiresAt: new Date(snapshot.expiresAt).toISOString(),
							cached: snapshot.cached,
							...reportOptions(projects, costCenters, snapshot.vouchers)
						}
					});
				} catch (cause) {
					console.error(`[resultat] Rapport för räkenskapsår ${year.Id} misslyckades:`, cause);
					if (cause instanceof FortnoxReportError && [401, 403].includes(cause.status))
						send({ type: 'setup' });
					else
						send({
							type: 'error',
							message: 'Kunde inte hämta en fullständig resultatrapport. Försök igen.'
						});
				} finally {
					if (!closed) {
						closed = true;
						controller.close();
					}
				}
			})();
		},
		cancel() {
			closed = true;
		}
	});
	return new Response(stream, {
		headers: { ...headers, 'content-type': 'application/x-ndjson; charset=utf-8' }
	});
};
