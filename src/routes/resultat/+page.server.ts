import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getResultatConnection } from '$lib/server/resultat-connection';
import Routes from '@/constants/routes.constants';
import { reportClient, FortnoxReportError } from '$lib/server/resultat';
import { getProfitCenters, getProjects } from '$lib/prisma';
import { reportOptions } from '@/helpers/resultat.helpers';
import { reportFilters, selectReportYear } from '$lib/server/resultat-filters';

export const load: PageServerLoad = async (event) => {
	const { user } = await event.parent();
	if (!user.canApprove && !user.isPengU) error(403, 'Du saknar behörighet att visa resultat.');
	event.setHeaders({ 'cache-control': 'private, no-store' });
	const fortnoxLoginUrl = `${Routes.Resultat}/login`;
	const setup = { fortnoxSetupRequired: true as const, fortnoxLoginUrl };
	const connection = await getResultatConnection();
	if (!connection) return setup;
	let years;
	try {
		years = await reportClient(connection.api).years();
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
