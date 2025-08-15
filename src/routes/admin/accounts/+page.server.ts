import { getAccounts, updateAccount } from '$lib/prisma';
import type { PageServerLoad } from './$types';

import { success, formDataToJson, stringToJson } from '@/helpers/form.helpers';
import { fail } from '@sveltejs/kit';
import { FormAccountNames, type FormAccount, type JsonFormAccount } from '@/models/voucher.models';
import { makeAccount } from '$lib/voucher';
import { formatZodErrors } from '@/helpers/zod.helpers';
import { accountTypeSchema } from '@/models/zod.models';

export const load = (async () => {
	const accounts = await getAccounts();
	return {
		accounts
	};
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ request }) => {
		const data = await request.formData();
		const jsonFormAccount = formDataToJson<JsonFormAccount>(data);
		const formUpdatedAccount = stringToJson<FormAccount>(jsonFormAccount.account);
		if (!formUpdatedAccount) {
			return fail(400, { errors: [{ message: 'Ogiltig kontodata' }] });
		}
		const updatedAccount = makeAccount(formUpdatedAccount);
		const schema = await accountTypeSchema.safeParseAsync(updatedAccount);
		if (schema.error) {
			return fail(400, formatZodErrors(schema.error, updatedAccount.number.toString()));
		}

		const accounts = await getAccounts();
		const occupiedAcc = accounts.find((a) => a.voucherLabel === updatedAccount.voucherLabel);
		if (occupiedAcc) {
			return fail(400, {
				errors: [
					{
						field: FormAccountNames.VOUCHERLABEL + updatedAccount.number,
						message: 'Kontonamnet är upptaget av konto ' + occupiedAcc.number + '.'
					}
				]
			});
		}
		const account = await updateAccount(updatedAccount);
		return success('Kontonamn sparat!', account.number + ' | ' + account.voucherLabel);
	}
};
