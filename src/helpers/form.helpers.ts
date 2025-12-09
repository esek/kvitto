import { goto, invalidateAll } from '$app/navigation';
import { CONFETTI_REDIRECT_STATUS } from '@/constants/confetti.constants';
import { confettiStore } from '@/context/confetti.store';
import { formErrors, formLoad } from '@/context/form.store';
import { notifications } from '@/context/notifications.store';
import { readMessage } from './url.helpers';
export const formDataToJson = <T>(formData: FormData) => {
	return Object.fromEntries(formData) as unknown as T;
};

export const stringToJson = <T>(string: string | null) => {
	if (!string) {
		return null;
	}

	if (typeof string !== 'string') {
		return string as unknown as T;
	}

	return JSON.parse(string) as unknown as T;
};

type Result = {
	type: string;
	status: number;
	data?: {
		errors: { field: string; message: string }[];
		title?: string;
		message?: string;
	};
	location: string;
};

export const success = (title?: string, message?: string) => {
	return { title: title, message: message };
};

export const responseHandler = () => {
	return async ({ result }: { result: unknown }) => {
		const res = result as Result;
		formErrors.set({});
		if (res.type === 'success') {
			const title = res.data?.title ?? 'Det lyckades!';
			if (res.data?.message) {
				notifications.add('success', title, res.data.message);
			} else {
				notifications.add('success', title);
			}
			await invalidateAll();
		} else if (res.type === 'failure') {
			if (res.data?.errors) {
				const errors = res.data.errors;
				errors.sort((a, b) => a.message.length - b.message.length);
				errors.forEach((e) => {
					notifications.add(
						'danger',
						'Något gick fel!',
						e.message,
						50 * errors.length * e.message.length
					);
				});
				const errorRecord = errors.reduce<Record<string, string>>((acc, curr) => {
					acc[curr.field] = curr.message;
					return acc;
				}, {});
				formErrors.set(errorRecord);
			} else {
				notifications.add('danger', 'Något gick fel!', 'Okänt fel, försök igen.');
			}
		}
		if (res.type === 'redirect') {
			const message = readMessage(res.location);
			if (message) {
				const type = res.status === CONFETTI_REDIRECT_STATUS ? 'success' : 'warning';
				message.forEach((m) => {
					notifications.add(type, type === 'success' ? 'Tjohoo!' : 'OBS!', m, m.length * 150);
				});
			}
			if (res.status === CONFETTI_REDIRECT_STATUS) {
				confettiStore.trigger();
			}
			goto(res.location, { invalidateAll: true });
		}
		formLoad.set(false);
	};
};
