import { createVoucher } from '$lib/prisma';
import { formDataToJson, stringToJson, success } from '@/helpers/form.helpers.js';
import type { FormVoucher, FormVoucherWithAttachment } from '@/models/voucher.models';
import { voucherSchema } from '@/models/zod.models';
import { fail, redirect } from '@sveltejs/kit';
import { makeVoucher } from '$lib/voucher.js';
import { saveFile } from '$lib/file.js';
import { toDate } from '@/helpers/date.helpers.js';
import { formatZodErrors } from '@/helpers/zod.helpers.js';
import { sendNewVoucherEmail } from '$lib/email.js';
import { UTSKOTT_LABELS } from '@/constants/utskott.contstants.js';
import Routes from '@/constants/routes.constants';
import { CONFETTI_REDIRECT_STATUS } from '@/constants/confetti.constants.js';

export const actions = {
	submitVoucher: async ({ request }) => {
		const formData = await request.formData();
		const formVoucherWithAttachment = formDataToJson<FormVoucherWithAttachment>(formData);
		const formVoucher = stringToJson<FormVoucher>(formVoucherWithAttachment.voucher);
		if (!formVoucher) {
			return fail(400, { errors: [{ message: 'Ogiltig verifikatdata' }] });
		}

		const newVoucher = await makeVoucher(formVoucher);
		const schema = await voucherSchema.safeParseAsync(newVoucher);
		if (schema.error) {
			return fail(400, formatZodErrors(schema.error));
		}

		const attachment = formVoucherWithAttachment.attachment;
		if (attachment && attachment.size !== 0) {
			newVoucher.attachmentUrl = await saveFile(toDate().toISOString(), attachment);
		}

		const voucher = await createVoucher(newVoucher);
		const res = await sendNewVoucherEmail(voucher.id, voucher.utskott, voucher.description);
		if (!res.success) {
			return success(
				'Skickad!',
				'Det gick dock inte att mailavisera den ansvariga, kontakta gärna utskottschefen för ' +
					UTSKOTT_LABELS[voucher.utskott] +
					' och en macapär och berätta detta.'
			);
		}
		redirect(CONFETTI_REDIRECT_STATUS, Routes.Home);
	}
};
