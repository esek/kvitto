import { createAccount, deleteAccount, getAccounts } from '$lib/prisma';
import { type NewAccount, type FormAccount, type FormDeleteAccount } from '@/models/voucher.models';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { makeNewAccount } from '@/helpers/voucher.helpers';
import { formDataToJson } from '@/helpers/form.helpers';

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
		if (formAccount.number.length !== 4 || !parseInt(formAccount.number)) {
			return fail(400, { number: formAccount.number, incorrect: true });
		}
		if (!formAccount.voucherLabel) {
			return fail(400, { voucherLabel: formAccount.voucherLabel, missingVoucherLabel: true });
		}
		if (!formAccount.accountingLabel) {
			return fail(400, {
				accountingLabel: formAccount.accountingLabel,
				missingAccountingLabel: true
			});
		}
		const newAccount: NewAccount = makeNewAccount(formAccount);
		const account = await createAccount(newAccount);
		return { account };
	},
	remove: async ({ request }) => {
		const data = await request.formData();
		const { number } = formDataToJson<FormDeleteAccount>(data);
		if (number.length !== 4 || !parseInt(number)) {
			return fail(400, { number, incorrect: true });
		}
		try {
			const account = await deleteAccount(parseInt(number));
			return { account };
		} catch {
			return fail(400, { number, exists: false });
		}
	}
};
