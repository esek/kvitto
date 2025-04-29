import { createProfitCenter, deleteProfitCenter, getProfitCenters } from '$lib/prisma';
import type { NewProfitCenter, FormProfitCenter } from '@/models/voucher.models';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { makeProfitCenter } from '@/helpers/voucher.helpers';
import { formDataToJson, success } from '@/helpers/form.helpers';
import { profitCenterSchema } from '@/models/zod.models';

export const load = (async () => {
	const profitCenters = await getProfitCenters();
	return {
		profitCenters
	};
}) satisfies PageServerLoad;

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const formProfitCenter = formDataToJson<FormProfitCenter>(data);
		const newProfitCenter: NewProfitCenter = makeProfitCenter(formProfitCenter);
		const schema = await profitCenterSchema.safeParseAsync(newProfitCenter);
		if (schema.error) {
			return fail(400, schema.error.formErrors);
		}
		const profitCenter = await createProfitCenter(newProfitCenter);
		return success('Kostnadsställe skapat!', profitCenter.name + '|' + profitCenter.utskott);
	},
	remove: async ({ request }) => {
		const data = await request.formData();
		const { name } = formDataToJson<FormProfitCenter>(data);
		try {
			const profitCenter = await deleteProfitCenter(name);
			return success('Kostnadsställe raderat!', profitCenter.name + '|' + profitCenter.utskott);
		} catch {
			return fail(400, { name, exists: false });
		}
	}
};
