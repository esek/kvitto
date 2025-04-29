import { createAccount, deleteAccount, getAccounts } from '$lib/prisma';
import { type NewAccount, type FormAccount } from '@/models/voucher.models';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { makeAccount } from '@/helpers/voucher.helpers';
import { formDataToJson, success } from '@/helpers/form.helpers';
import { accountTypeSchema } from '@/models/zod.models';

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
			return fail(400, schema.error.formErrors);
		}
		const account = await createAccount(newAccount);
		return success(
			'Konto skapat!',
			account.number + ' | ' + account.voucherLabel + '|' + account.accountingLabel
		);
	},
	remove: async ({ request }) => {
		const data = await request.formData();
		const { number } = formDataToJson<FormAccount>(data);
		if (number.length !== 4 || !parseInt(number)) {
			return fail(400, { number, incorrect: true });
		}
		try {
			const account = await deleteAccount(parseInt(number));
			return success(
				'Konto raderat!',
				account.number + ' | ' + account.voucherLabel + '|' + account.accountingLabel
			);
		} catch {
			return fail(400, { number, exists: false });
		}
	}
};
