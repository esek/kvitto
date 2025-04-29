import { getAccounts, getVoucher, getProfitCenters, getProjects, updateVoucher } from '$lib/prisma';
import { error } from 'console';
import type { PageServerLoad } from './$types';
import { formDataToJson } from '@/helpers/form.helpers';
import type { FormVoucher } from '@/models/voucher.models';
import { redirect } from '@sveltejs/kit';
import { makeVoucher } from '@/helpers/voucher.helpers';
import { voucherSchema } from '@/models/zod.models';
import { fail } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const { id } = params;
	const idAsNumber = parseInt(id);
	if (isNaN(idAsNumber)) {
		throw error(400, 'ID för verifikat måste vara nummer');
	}
	const voucher = await getVoucher(idAsNumber);
	if (!voucher) {
		throw error(404, 'Det önskade verifikatet finns inte.');
	}
	const accounts = await getAccounts();
	const profitCenters = await getProfitCenters();
	const projects = await getProjects();
	return {
		voucher,
		accounts,
		profitCenters,
		projects
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const formUpdatedVoucher = formDataToJson<FormVoucher>(data);
		const updatedVoucher = makeVoucher(formUpdatedVoucher);
		const schema = await voucherSchema.safeParseAsync(updatedVoucher);
		if (schema.error) {
			return fail(400, schema.error.formErrors);
		}
		const voucher = await updateVoucher(updatedVoucher);
		throw redirect(302, '');
	}
};
