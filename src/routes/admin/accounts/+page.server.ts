import { createAccount, deleteAccount, getAccounts } from '$lib/prisma';
import { type NewAccount, type FormAccount } from '@/models/voucher.models';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { formDataToJson, success } from '@/helpers/form.helpers';
import { accountTypeSchema } from '@/models/zod.models';
import { makeAccount } from '$lib/voucher';
import { formatZodErrors } from '@/helpers/zod.helpers';

export const load = (async () => {
	const accounts = await getAccounts();
	return {
		accounts
	};
}) satisfies PageServerLoad;

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const formAccount = formDataToJson<FormAccount>(data);
		const newAccount: NewAccount = makeAccount(formAccount);
		const schema = await accountTypeSchema.safeParseAsync(newAccount);
		if (schema.error) {
			return fail(400, formatZodErrors(schema.error));
		}
		const account = await createAccount(newAccount);
		return success(
			'Konto skapat!',
			account.number + ' | ' + account.voucherLabel + '|' + account.accountingLabel
		);
	},
	remove: async ({ request }) => {
		const data = await request.formData();
		const { voucherLabel } = formDataToJson<FormAccount>(data);
		try {
			const account = await deleteAccount(voucherLabel);
			return success(
				'Konto raderat!',
				account.number + ' | ' + account.voucherLabel + '|' + account.accountingLabel
			);
		} catch {
			return fail(400, { voucherLabel, exists: false });
		}
	}
};
