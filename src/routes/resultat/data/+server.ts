import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/auth';
import { populateUser } from '@/helpers/user.helpers';
import { ensureFortnoxSession } from '$lib/server/fortnox-session';
import { reportClient, FortnoxReportError } from '$lib/server/resultat';
import { getFortnoxApiClient } from '$lib/fortnox';
import { getAccounts, getProfitCenters, getProjects } from '$lib/prisma';
import { aggregateResultat, reportOptions } from '@/helpers/resultat.helpers';
import { reportFilters, selectReportYear } from '$lib/server/resultat-filters';
import { voucherCache, voucherCacheKey } from '$lib/server/resultat-cache';
import type { ReportEvent } from '@/models/resultat.models';

export const POST: RequestHandler = async (event) => {
	// +server handlers do not run parent layout loads. Authorize every request,
	// including requests that will be served entirely from the cache.
	// auth-client's serverLoad currently reads only locals, but its type requires
	// the load-only helpers too. Supply them when using it in a request handler.
	const { user: authenticated } = await auth.serverLoad({
		...event,
		parent: async () => ({}),
		depends: () => {},
		untrack: (fn) => fn()
	});
	if (!authenticated) error(401, 'Logga in i Kvitto för att visa resultat.');
	const user = await populateUser(authenticated);
	if (!user.verified || (!user.canApprove && !user.isPengU))
		error(403, 'Du saknar behörighet att visa resultat.');
	if (event.request.headers.get('origin') !== event.url.origin) error(403, 'Ogiltigt ursprung.');
	const headers = { 'cache-control': 'private, no-store', 'x-accel-buffering': 'no' };
	if (!(await ensureFortnoxSession(event))) return json({ type: 'setup' }, { headers });
	const client = reportClient(getFortnoxApiClient(event.fetch));
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
	const sessionId = event.cookies.get('fortnox_session_id');
	if (!sessionId) return json({ type: 'setup' }, { headers });
	const key = voucherCacheKey(sessionId, year);
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
						(progress) => reportClient(getFortnoxApiClient(event.fetch), progress).vouchers(year),
						(progress) => send({ type: 'progress', progress }),
						{ refresh }
					);
					const [accounts, projects, costCenters] = await Promise.all([
						getAccounts(),
						getProjects(),
						getProfitCenters()
					]);
					send({
						type: 'result',
						result: {
							report: aggregateResultat(snapshot.vouchers, filters, accounts),
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
