import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ensureFortnoxSession } from '$lib/server/fortnox-session';
import Routes from '@/constants/routes.constants';
import { reportClient, FortnoxReportError } from '$lib/server/resultat';
import { getFortnoxApiClient } from '$lib/fortnox';
import { getProfitCenters, getProjects } from '$lib/prisma';
import { reportOptions } from '@/helpers/resultat.helpers';
import { reportFilters, selectReportYear } from '$lib/server/resultat-filters';

export const load: PageServerLoad = async (event) => {
	const { user } = await event.parent();
	if (!user.canApprove && !user.isPengU) error(403, 'Du saknar behörighet att visa resultat.');
	event.setHeaders({ 'cache-control': 'private, no-store' });
	const fortnoxLoginUrl = `${Routes.FortnoxLogin}?redirect_uri=${encodeURIComponent(event.url.toString())}`;
	const setup = { fortnoxSetupRequired: true as const, fortnoxLoginUrl };
	if (!(await ensureFortnoxSession(event))) return setup;
	let years;
	try {
		years = await reportClient(getFortnoxApiClient(event.fetch)).years();
	} catch (cause) {
		console.error('[resultat] Kunde inte hämta räkenskapsår:', cause);
		if (cause instanceof FortnoxReportError && [401, 403].includes(cause.status)) return setup;
		error(502, 'Kunde inte hämta räkenskapsår från Fortnox. Försök igen.');
	}
	const year = selectReportYear(years, event.url.searchParams.get('year'));
	const filters = reportFilters(event.url.searchParams, year);
	const [projects, costCenters] = await Promise.all([getProjects(), getProfitCenters()]);
	return {
		fortnoxSetupRequired: false as const,
		fortnoxLoginUrl,
		years,
		year,
		filters,
		...reportOptions(projects, costCenters)
	};
};
