import { redirect } from '@sveltejs/kit';
import type { FormNewPrivateVoucher } from '@/models/voucher.models';
import { makeNewPrivateVoucher } from '@/helpers/voucher.helpers';
import { createPrivateVoucher } from '$lib/prisma';
import { saveFile } from '$lib/file';
import { toDate } from '@/helpers/date.helpers';
import { formDataToJson } from '@/helpers/form.helpers.js';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const formNewPrivateVoucher = formDataToJson<FormNewPrivateVoucher>(data);
		const newPrivateVoucher = makeNewPrivateVoucher(formNewPrivateVoucher);
		//TODO: zod parse object
		newPrivateVoucher.voucher.receiptUrl = await saveFile(
			toDate().toISOString(),
			formNewPrivateVoucher.receipt
		);

		const privateVoucher = await createPrivateVoucher(newPrivateVoucher);
		throw redirect(302, '');
	}
};
