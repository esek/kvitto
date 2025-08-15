import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const CONFETTI_KEY = 'kvitto_confetti_trigger';

function createConfettiStore() {
	const { subscribe, set } = writable(false);

	return {
		subscribe,
		trigger: () => {
			if (browser) {
				sessionStorage.setItem(CONFETTI_KEY, 'true');
				set(true);
			}
		},
		checkAndClear: (): boolean => {
			if (browser) {
				const shouldTrigger = sessionStorage.getItem(CONFETTI_KEY) === 'true';
				if (shouldTrigger) {
					sessionStorage.removeItem(CONFETTI_KEY);
					set(false);
					return true;
				}
			}
			return false;
		},
		clear: () => {
			if (browser) {
				sessionStorage.removeItem(CONFETTI_KEY);
				set(false);
			}
		}
	};
}

export const confettiStore = createConfettiStore();
