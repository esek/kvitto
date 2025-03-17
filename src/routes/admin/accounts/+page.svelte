<script lang="ts">
	import Account from '@components/kvitto/account.svelte';
	import type { PageData } from './$types';
	import NewAccount from '@components/kvitto/new-account.svelte';
	import EText from '@components/ui/typography/e-text.svelte';
	import EBox from '@components/ui/e-box.svelte';

	let { data }: { data: PageData } = $props();
</script>

<EBox className="grid w-fit gap-2">
	<EText isBold>Konton</EText>
	{#each data.accounts as acc (acc)}
		<Account account={acc} />
	{/each}
	<EText isBold>Lägg till konto</EText>
	<NewAccount />
</EBox>
