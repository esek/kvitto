import Routes from '@/constants/routes.constants';
import { success } from '@/helpers/form.helpers.js';
import { fail } from '@sveltejs/kit';

export const actions = {
	sync: async ({ fetch }) => {
		const res = [
			await fetch(Routes.FortnoxAccounts, {
				method: 'GET'
			}),
			await fetch(Routes.FortnoxProjects, {
				method: 'GET'
			}),
			await fetch(Routes.FortnoxProfitCenters, {
				method: 'GET'
			}),
			await fetch(Routes.FortnoxSuppliers, {
				method: 'GET'
			})
		];
		const err = res.filter((r) => r.status !== 200);
		if (err.length !== 0) {
			const errorMessages = await Promise.all(
				err.map(async (e) => e.status + ' | ' + (await e.text()))
			);
			return fail(400, {
				errors: errorMessages.map((e) => ({
					message: e
				}))
			});
		}
		return success(
			'Synkat!',
			'Konton, projekt, kostnadsställen och leverantörer är synkade med fortnox'
		);
	}
};
