<script lang="ts">
	import { Star } from 'lucide-svelte';

	import { getAccountFavourites } from '@/context/account-favourites.svelte';
	let { account }: { account: number } = $props();
	const favourites = getAccountFavourites();
	const favourite = $derived(favourites.numbers.includes(account));

	const label = $derived(
		`${favourite ? 'Ta bort' : 'Lägg till'} konto ${account} ${favourite ? 'från' : 'som'} favorit`
	);
</script>

<button
	type="button"
	onclick={() => favourites.toggle(account)}
	disabled={favourites.busy}
	aria-pressed={favourite}
	aria-label={label}
	title={label}
	class="rounded p-2 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 disabled:opacity-50 dark:hover:bg-gray-700"
>
	<Star size={18} fill={favourite ? 'currentColor' : 'none'} aria-hidden="true" />
</button>
