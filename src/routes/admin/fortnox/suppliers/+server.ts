import { PrismaClient, type Supplier } from '@prisma/client';
import type { RequestHandler } from './$types';
import { getFortnoxApiClient } from '$lib/fortnox';
import { manageError } from '@/helpers/fortnox.helpers';

export const GET: RequestHandler = async ({ fetch }) => {
	const fortnoxApi = getFortnoxApiClient(fetch);

	const { data, error } = await fortnoxApi.GET('/3/suppliers');

	if (!data || error) {
		return manageError(error);
	}

	if (!data.Suppliers) {
		return new Response('Found no fortnox suppliers.', { status: 404 });
	}

	const suppliers: Supplier[] = data.Suppliers.filter((s) => s.Active && s.SupplierNumber).map(
		(s) => {
			const company: Supplier = {
				number: s.SupplierNumber ?? '',
				name: s.Name
			};
			return company;
		}
	);

	const prismaClient = new PrismaClient();
	prismaClient.$transaction([
		prismaClient.supplier.deleteMany(),
		prismaClient.supplier.createMany({ data: suppliers })
	]);
	return new Response('Synced suppliers with fortnox!', { status: 200 });
};
