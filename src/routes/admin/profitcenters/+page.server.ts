import { getProfitCenters, updateProfitCenter } from '$lib/prisma';
import type { FormProfitCenter, JsonFormProfitCenter } from '@/models/voucher.models';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { profitCenterSchema } from '@/models/zod.models';
import { makeProfitCenter } from '$lib/voucher';
import { formatZodErrors } from '@/helpers/zod.helpers';
import { stringToJson, formDataToJson, success } from '@/helpers/form.helpers';

export const load = (async () => {
	const profitCenters = await getProfitCenters();
	return {
		profitCenters
	};
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ request }) => {
		const data = await request.formData();
		const jsonFormPC = formDataToJson<JsonFormProfitCenter>(data);
		const formUpdatedPC = stringToJson<FormProfitCenter>(jsonFormPC.profitCenter);
		if (!formUpdatedPC) {
			return fail(400, { errors: [{ message: 'Ogiltig kostnadsställedata' }] });
		}
		const updatedPC = makeProfitCenter(formUpdatedPC);
		const schema = await profitCenterSchema.safeParseAsync(updatedPC);
		if (schema.error) {
			return fail(400, formatZodErrors(schema.error, updatedPC.name));
		}

		const profitCenter = await updateProfitCenter(updatedPC);
		return success('Utskott sparat!', profitCenter.name + ' | ' + profitCenter.utskott);
	}
};
