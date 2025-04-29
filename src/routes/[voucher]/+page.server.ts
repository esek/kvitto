import { redirect, error } from '@sveltejs/kit';
import { makeVoucher } from '@/helpers/voucher.helpers';
import { createVoucher } from '$lib/prisma';
import { saveFile } from '$lib/file';
import { toDate } from '@/helpers/date.helpers';
import { formDataToJson } from '@/helpers/form.helpers.js';
import type { FormVoucher } from '@/models/voucher.models';
import type { PageServerLoad } from './$types';
import { voucherSchema } from '@/models/zod.models';
import { fail } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const { voucher } = params;
	if (voucher === 'blue') {
		return {
			isPrivate: true
		};
	} else if (voucher === 'green') {
		return {
			isPrivate: false
		};
	}
	throw error(400, 'Verifikattypen existerar inte');
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const formNewVoucher = formDataToJson<FormVoucher>(formData);
		const newVoucher = makeVoucher(formNewVoucher);
		if (formNewVoucher.receipt) {
			newVoucher.receiptUrl = await saveFile(toDate().toISOString(), formNewVoucher.receipt);
		}
		const schema = await voucherSchema.safeParseAsync(newVoucher);
		if (schema.error) {
			return fail(400, schema.error.formErrors);
		}
		const voucher = await createVoucher(newVoucher);
		throw redirect(302, '');
	}
};
