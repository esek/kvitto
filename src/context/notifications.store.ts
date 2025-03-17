import type { INotification } from '../models/notification.models';
import { writable } from 'svelte/store';
import { nanoid } from 'nanoid';

const { subscribe, update } = writable<INotification[]>([]);

const addNotification = (
	type: INotification['type'],
	title: string,
	message?: string,
	timeout: number = 2000
) => {
	update((curr) => {
		const id = nanoid();
		curr.push({ timeout, message, type, title, id });

		return curr;
	});
};

const deleteNotification = (idx: number) => {
	update((curr) => {
		curr.splice(idx, 1);
		return curr;
	});
};

export const notifications = {
	subscribe,
	add: addNotification,
	delete: deleteNotification
};
