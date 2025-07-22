import { getAccounts, getProfitCenters, getProjects } from '$lib/prisma';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	const accounts = await getAccounts();
	const profitCenters = await getProfitCenters();
	const projects = await getProjects();

	return {
		accounts: accounts,
		profitCenters: profitCenters,
		projects: projects
	};
}) satisfies LayoutServerLoad;
