import { getFortnoxApiClient } from '$lib/fortnox';
import { PrismaClient, type ProfitCenter } from '@prisma/client';
import { manageError, utskottFromCostCenterCode } from '@/helpers/fortnox.helpers';
import { getProfitCenters } from '$lib/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
	const fortnoxApi = getFortnoxApiClient(fetch);

	const { data, error } = await fortnoxApi.GET('/3/costcenters', {
		params: { query: { limit: 500 } } as unknown as {}
	});

	if (!data || error) {
		return manageError(error);
	}

	if (!data.CostCenters) {
		return new Response('Found no fortnox cost centers.', { status: 404 });
	}

	const oldPCs = await getProfitCenters();

	const profitCenters: ProfitCenter[] = data.CostCenters.filter((c) => c.Active).map((c) => {
		const oldUtskott = oldPCs.find((opc) => opc.name === c.Code)?.utskott;
		const profitCenter: ProfitCenter = {
			utskott: oldUtskott ?? utskottFromCostCenterCode(c.Code),
			name: c.Code
		};
		return profitCenter;
	});

	const prismaClient = new PrismaClient();
	prismaClient.$transaction([
		prismaClient.profitCenter.deleteMany(),
		prismaClient.profitCenter.createMany({ data: profitCenters })
	]);
	return new Response('Synced profit centers with fortnox!', { status: 200 });
};
