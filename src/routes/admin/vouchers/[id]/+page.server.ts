import {
	getAccounts,
	getVoucher,
	getProfitCenters,
	getProjects,
	updateVoucher,
	deleteVoucher,
	getSuppliers,
	markVoucherAsAccounted
} from '$lib/prisma';
import { error } from 'console';
import type { PageServerLoad } from './$types';
import { formDataToJson, stringToJson, success } from '@/helpers/form.helpers';
import type { FormVoucher, FormVoucherWithAttachment, VoucherType } from '@/models/voucher.models';
import { fortnoxVoucherSchema, voucherSchema } from '@/models/zod.models';
import { fail, redirect } from '@sveltejs/kit';
import { makeVoucher } from '$lib/voucher';
import { formatZodErrors } from '@/helpers/zod.helpers';
import { sendUpdatedVoucherEmail } from '$lib/email';
import Routes from '@/constants/routes.constants';
import { addMessage, addRedirect, getOAuth2Redirect } from '@/helpers/url.helpers';
import { getFortnoxAccessToken } from '$lib/fortnox';
import { CONFETTI_REDIRECT_STATUS } from '@/constants/confetti.constants';
import type { User } from '@/models/user.model';
import { title } from '@/helpers/user.helpers';

export const load = (async ({ params }) => {
	const { id } = params;
	const voucher = await getVoucher(id);
	if (!voucher) {
		throw error(404, 'Det önskade verifikatet finns inte.');
	}
	const accounts = await getAccounts();
	const profitCenters = await getProfitCenters();
	const projects = await getProjects();
	const suppliers = await getSuppliers();
	return {
		voucher,
		accounts,
		profitCenters,
		projects,
		suppliers
	};
}) satisfies PageServerLoad;

const userFromForm = async (data: FormData) => {
	const formUser = formDataToJson<{ user: string }>(data);
	const user = stringToJson<User>(formUser.user);
	return user;
};

const voucherFromForm = async (data: FormData) => {
	const formVoucher = formDataToJson<FormVoucherWithAttachment>(data);
	const formUpdatedVoucher = stringToJson<FormVoucher>(formVoucher.voucher);
	if (!formUpdatedVoucher) {
		return {
			updatedVoucher: null,
			error: fail(400, { errors: [{ message: 'Ogiltig verifikatdata' }] })
		};
	}
	const updatedVoucher = await makeVoucher(formUpdatedVoucher);
	return { updatedVoucher, error: null };
};

const saveVoucher = async (updatedVoucher: VoucherType) => {
	const schema = await voucherSchema.safeParseAsync(updatedVoucher);
	if (schema.error) {
		return { voucher: null, error: fail(400, formatZodErrors(schema.error)) };
	}
	const voucher = await updateVoucher(updatedVoucher);
	return { voucher, error: null };
};

export const actions = {
	delete: async ({ params }) => {
		const { id } = params;
		const res = await deleteVoucher(id);
		if (!res) {
			return fail(400, { errors: [{ message: 'Verifikatet kunde inte raderas' }] });
		}

		redirect(CONFETTI_REDIRECT_STATUS, Routes.AdminVouchers);
	},
	save: async ({ request }) => {
		const data = await request.formData();
		const { updatedVoucher, error } = await voucherFromForm(data);
		if (!updatedVoucher || error) {
			return error;
		}

		const { voucher, error: saveError } = await saveVoucher(updatedVoucher);
		if (!voucher || saveError) {
			return saveError;
		}

		const user = await userFromForm(data);
		if ((!user || user?.isPengU === false) && !!voucher.approvedBy) {
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
	togglepaid: async ({ request }) => {
		const data = await request.formData();
		const { updatedVoucher, error } = await voucherFromForm(data);
		if (!updatedVoucher || error) {
			return error;
		}

		// A voucher must be approved before it can be marked as paid
		// (un-marking an already-paid voucher is still allowed).
		if (!updatedVoucher.paid && !updatedVoucher.approvedBy) {
			return fail(400, {
				errors: [{ message: 'Verifikatet måste vara godkänt innan det kan markeras som betalt' }]
			});
		}

		updatedVoucher.paid = !updatedVoucher.paid;
		const { voucher, error: saveError } = await saveVoucher(updatedVoucher);
		if (!voucher || saveError) {
			return saveError;
		}

		return success(
			'Sparat!',
			`Verifikatet är nu markerad som ${voucher.paid ? 'betald' : 'obetald'} `
		);
	},
	togglearchived: async ({ request }) => {
		const data = await request.formData();
		const { updatedVoucher, error } = await voucherFromForm(data);
		if (!updatedVoucher || error) {
			return error;
		}

		updatedVoucher.archived = !updatedVoucher.archived;
		const { voucher, error: saveError } = await saveVoucher(updatedVoucher);
		if (!voucher || saveError) {
			return saveError;
		}

		return success(
			'Sparat!',
			`Verifikatet är nu ${voucher.archived ? 'arkiverat' : 'inte arkiverat'}`
		);
	},
	toggleapproved: async ({ request }) => {
		const data = await request.formData();
		const { updatedVoucher, error } = await voucherFromForm(data);
		if (!updatedVoucher || error) {
			return error;
		}

		const user = await userFromForm(data);
		if (!user) {
			return fail(400, { errors: [{ message: 'Ogiltig användardata' }] });
		}

		if (!updatedVoucher.approvedBy) {
			updatedVoucher.approvedBy = title(user);
			updatedVoucher.approvedAt = new Date();
		} else {
			updatedVoucher.approvedBy = null;
			updatedVoucher.approvedAt = null;
		}

		const { voucher, error: saveError } = await saveVoucher(updatedVoucher);
		if (!voucher || saveError) {
			return saveError;
		}

		return success('Spara!', `Verifikatet är ${updatedVoucher.approvedBy ? 'godkänt' : 'avböjt'}`);
	},

	fortnox: async ({ fetch, request, params, url, cookies }) => {
		const { id } = params;
		const data = await request.formData();
		const { updatedVoucher, error } = await voucherFromForm(data);
		if (!updatedVoucher || error) {
			return error;
		}

		const user = await userFromForm(data);
		if (!user) {
			return fail(400, { errors: [{ message: 'Ogiltig användardata' }] });
		}

		updatedVoucher.accountedBy = title(user);

		const schema = await fortnoxVoucherSchema.safeParseAsync(updatedVoucher);
		if (schema.error) {
			return fail(400, formatZodErrors(schema.error));
		}
		await updateVoucher(updatedVoucher);

		//Does not use token here, it is just to check if we need to log in
		const fortnoxAuth = getFortnoxAccessToken(cookies);
		if (!fortnoxAuth) {
			const loginWithLoopback = getOAuth2Redirect(addRedirect(url, url.href), Routes.FortnoxLogin);
			throw redirect(302, loginWithLoopback);
		}

		const res = await fetch(Routes.FortnoxVouchersId(id), { method: 'POST' });
		if (res.status !== 200 && res.status !== 201) {
			return fail(res.status, { errors: [{ message: await res.text() }] });
		}

		await markVoucherAsAccounted(id);

		if (res.status === 201) {
			redirect(300, addMessage(Routes.AdminVouchers, 'Bokfördes med fel: ' + (await res.text())));
		}
		redirect(CONFETTI_REDIRECT_STATUS, addMessage(Routes.AdminVouchers, await res.text()));
	}
};
