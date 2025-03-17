import { redirect } from '@sveltejs/kit';
import type { FormNewVoucher } from '@/models/voucher.models';
import { makeNewVoucher } from '@/helpers/voucher.helpers';
import { createVoucher } from '$lib/prisma';
import { saveFile } from '$lib/file';
import { toDate } from '@/helpers/date.helpers';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const rawVoucher = Object.fromEntries(data) as unknown as FormNewVoucher;
		//TODO: zod parse object

		const newVoucher = await makeNewVoucher(rawVoucher);

		newVoucher.receiptUrl = await saveFile(toDate().toISOString(), rawVoucher.receipt);

		const voucher = await createVoucher(newVoucher);
		throw redirect(302, '');
	}
};
