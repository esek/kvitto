import { createProfitCenter, deleteProfitCenter, getProfitCenters } from '$lib/prisma';
import type { NewProfitCenter, FormProfitCenter } from '@/models/voucher.models';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { makeNewProfitCenter } from '@/helpers/voucher.helpers';
import { Utskott } from '@prisma/client';
import { formDataToJson } from '@/helpers/form.helpers';

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
		const newProfitCenter: NewProfitCenter = makeNewProfitCenter(formProfitCenter);
		if (!newProfitCenter.name) {
			return fail(400, { name: formProfitCenter.name, nameMissing: true });
		}
		if (!newProfitCenter.utskott || !Object.values(Utskott).includes(newProfitCenter.utskott)) {
			return fail(400, { utskott: formProfitCenter.utskott, utskottMissing: true });
		}
		const profitCenter = await createProfitCenter(newProfitCenter);
		return { profitCenter };
	},
	remove: async ({ request }) => {
		const data = await request.formData();
		const { name } = formDataToJson<{ name: string }>(data);
		try {
			const profitCenter = await deleteProfitCenter(name);
			return { profitCenter };
		} catch {
			return fail(400, { name, exists: false });
		}
	}
};
