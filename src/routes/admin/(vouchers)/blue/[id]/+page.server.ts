import {
	getAccounts,
	getPrivateVoucher,
	getProfitCenters,
	getProjects,
	updatePrivateVoucher
} from '$lib/prisma';
import { error } from 'console';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { formDataToJson } from '@/helpers/form.helpers';
import type { FormPrivateVoucherMod } from '@/models/voucher.models';
import { makeNewPrivateVoucherMod } from '@/helpers/voucher.helpers';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const { id } = params;
	const idAsNumber = parseInt(id);
	if (isNaN(idAsNumber)) {
		throw error(400, 'ID för verifikat måste vara nummer');
	}
	const privateVoucher = await getPrivateVoucher(idAsNumber);
	if (!privateVoucher) {
		throw error(404, 'Det önskade verifikatet finns inte.');
	}
	const accounts = await getAccounts();
	const profitCenters = await getProfitCenters();
	const projects = await getProjects();
	return {
		privateVoucher,
		accounts,
		profitCenters,
		projects
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const formPrivateVoucherMod = formDataToJson<FormPrivateVoucherMod>(data);
		const newPrivateVoucherMod = makeNewPrivateVoucherMod(formPrivateVoucherMod);
		const privateVoucher = await updatePrivateVoucher(newPrivateVoucherMod);
		throw redirect(302, '');
	}
};
