import { writable } from 'svelte/store';

const errors = writable<Record<string, string>>({});

export const formErrors = {
	subscribe: errors.subscribe,
	set: (newErrors: Record<string, string>) => errors.set(newErrors)
};

const load = writable<boolean>(false);

export const formLoad = {
	subscribe: load.subscribe,
	set: (isLoading: boolean) => load.set(isLoading)
};
