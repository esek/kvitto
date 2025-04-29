import { invalidateAll } from '$app/navigation';
import { notifications } from '@/context/notifications.store';

export const formDataToJson = <T>(formData: FormData) => {
	return Object.fromEntries(formData) as unknown as T;
};

export const stringToJson = <T>(string: string | null) => {
	if (!string) {
		return null;
	}
	return JSON.parse(string) as unknown as T;
};

type Result = {
	type: string;
	status: number;
	data?: {
		formErrors?: [string];
		fieldErrors?: Record<string, string>;
		title?: string;
		message?: string;
	};
};

export const success = (title?: string, message?: string) => {
	return { title: title, message: message };
};

export const responseHandler = () => {
	return async ({ result }: { result: unknown }) => {
		const res = result as Result;
		if (res.type === 'success') {
			const title = res.data?.title ?? 'Det lyckades!';
			if (res.data?.message) {
				notifications.add('success', title, res.data.message);
			} else {
				notifications.add('success', title);
			}
			await invalidateAll();
		} else if (res.type === 'failure') {
			if (res.data?.fieldErrors) {
				const fieldObjs = Object.values(res.data.fieldErrors);
				fieldObjs.forEach((e) =>
					notifications.add('danger', 'Något gick fel!', e, 2000 * fieldObjs.length)
				);
			} else {
				notifications.add('danger', 'Något gick fel!', 'Okänt fel, försök igen.');
			}
		}
	};
};
