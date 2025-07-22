import {
	getAccounts,
	getVoucher,
	getProfitCenters,
	getProjects,
	updateVoucher,
	deleteVoucher
} from '$lib/prisma';
import { error } from 'console';
import type { PageServerLoad } from './$types';
import { formDataToJson, stringToJson, success } from '@/helpers/form.helpers';
import type { FormVoucher, FormVoucherWithAttachment } from '@/models/voucher.models';
import { fortnoxVoucherSchema, voucherSchema } from '@/models/zod.models';
import { fail, redirect } from '@sveltejs/kit';
import { makeVoucher } from '$lib/voucher';
import { formatZodErrors } from '@/helpers/zod.helpers';
import { sendUpdatedVoucherEmail } from '$lib/email';
import Routes from '@/constants/routes.constants';

export const load = (async ({ params }) => {
	const { id } = params;
	const voucher = await getVoucher(id);
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
	delete: async ({ params }) => {
		const { id } = params;
		const res = await deleteVoucher(id);
		if (!res) {
			return fail(400, { error: 'Verifikatet kunde inte raderas!' });
		}

		redirect(303, Routes.AdminVouchers);
	},
	save: async ({ request }) => {
		const data = await request.formData();
		const formVoucher = formDataToJson<FormVoucherWithAttachment>(data);
		const formUpdatedVoucher = stringToJson<FormVoucher>(formVoucher.voucher);
		if (!formUpdatedVoucher) {
			return fail(400, { error: 'Ogiltig verifikatdata' });
		}
		const updatedVoucher = await makeVoucher(formUpdatedVoucher);
		const schema = await voucherSchema.safeParseAsync(updatedVoucher);
		if (schema.error) {
			return fail(400, formatZodErrors(schema.error));
		}
		const voucher = await updateVoucher(updatedVoucher);

		//If you had a bad day, it just got worse
		if (data.get('ispengu') === 'false' && !!voucher.approvedBy) {
			const res = await sendUpdatedVoucherEmail(voucher.id);
			if (!res.success) {
				return success(
					'Sparad!',
					'Det gick dock inte att mailavisera PengU, kontakta gärna pengamästaren och en macapär och berätta detta.'
				);
			}
			return success('Sparad!', 'Mailaviserade PengU');
		}
		return success('Sparad!', 'Verifikatet har sparats.');
	},
	fortnox: async ({ request }) => {
		const data = await request.formData();
		const formVoucher = formDataToJson<FormVoucherWithAttachment>(data);
		const formUpdatedVoucher = stringToJson<FormVoucher>(formVoucher.voucher);
		if (!formUpdatedVoucher) {
			return fail(400, { error: 'Ogiltig verifikatdata' });
		}
		const updatedVoucher = await makeVoucher(formUpdatedVoucher);
		const schema = await fortnoxVoucherSchema.safeParseAsync(updatedVoucher);
		if (schema.error) {
			return fail(400, formatZodErrors(schema.error));
		}
		await updateVoucher(updatedVoucher);
		return success('Sparad!');
	}
};
