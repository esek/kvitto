import { getSuppliers } from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const suppliers = await getSuppliers();
	return { suppliers };
}) satisfies PageServerLoad;
