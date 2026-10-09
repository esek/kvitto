import { getContext, setContext } from 'svelte';
import { notifications } from './notifications.store';

const key = Symbol('account-favourites');

export function provideAccountFavourites(initial: () => number[]) {
	// Scoped to a layout instance, never a server-global store shared between users.
	let numbers = $derived([...initial()]);
	let busy = $state(false);
	const favourites = {
		get numbers() {
			return numbers;
		},
		get busy() {
			return busy;
		},
		async toggle(account: number) {
			if (busy) return;
			busy = true;
			try {
				const response = await fetch('/account-favourites', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ account, favourite: !numbers.includes(account) })
				});
				if (!response.ok) throw new Error('Kunde inte spara favoritkontot. Försök igen.');
				const result: { favourites: number[] } = await response.json();
				numbers = result.favourites;
			} catch {
				notifications.add('danger', 'Kunde inte spara favoritkontot', 'Försök igen.');
			} finally {
				busy = false;
			}
		}
	};
	setContext(key, favourites);
	return favourites;
}

export function getAccountFavourites() {
	return getContext<ReturnType<typeof provideAccountFavourites>>(key);
}
