import { PrismaClient, type Supplier } from '@prisma/client';
import type { RequestHandler } from './$types';
import { getFortnoxApiClient } from '$lib/fortnox';
import { manageError } from '@/helpers/fortnox.helpers';
import type { FortnoxSuppliersResponse } from '@/models/fortnox.models';

export const GET: RequestHandler = async ({ fetch }) => {
	const fortnoxApi = getFortnoxApiClient(fetch);

	const { data, error } = await fortnoxApi.GET('/3/suppliers', {
		params: { query: { limit: 500 } } as unknown as {}
	});

	if (!data || error) {
		return manageError(error);
	}

	const fortnoxData = data as FortnoxSuppliersResponse;
	const pagination = fortnoxData.MetaInformation;
	if (pagination['@TotalPages'] > 1) {
		for (let page = 2; page <= pagination['@TotalPages']; page++) {
			const { data: pageData, error: pageError } = await fortnoxApi.GET('/3/suppliers', {
				params: { query: { limit: 500, page } } as unknown as {}
			});
			if (!pageData || pageError) {
				return manageError(pageError);
			}
			const fortnoxPageData = pageData as FortnoxSuppliersResponse;
			fortnoxData.Suppliers.push(...fortnoxPageData.Suppliers);
		}
	}

	const suppliers: Supplier[] = fortnoxData.Suppliers.filter(
		(s) => s.Active && s.SupplierNumber
	).map((s) => {
		const company: Supplier = {
			number: s.SupplierNumber ?? '',
			name: s.Name
		};
		return company;
	});

	const prismaClient = new PrismaClient();
	await prismaClient.$transaction(
		suppliers.map((supplier) =>
			prismaClient.supplier.upsert({
				where: { number: supplier.number },
				update: { name: supplier.name },
				create: supplier
			})
		)
	);
	return new Response('Synced suppliers with fortnox!', { status: 200 });
};
