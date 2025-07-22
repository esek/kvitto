<script lang="ts">
	import type { PageData } from './$types';
	import EText from '@components/ui/typography/e-text.svelte';
	import ProfitCenter from '@components/kvitto/profit-center.svelte';
	import NewProfitCenter from '@components/kvitto/new-profit-center.svelte';
	import EBox from '@components/ui/e-box.svelte';

	let { data }: { data: PageData } = $props();
</script>

<EBox className="grid w-fit gap-2">
	<EText isBold>Kostnadsställen</EText>
	{#each data.profitCenters as pc (pc)}
		<ProfitCenter profitCenter={pc} />
	{/each}
	<EText isBold>Lägg till kostnadsställe</EText>
	<NewProfitCenter />
</EBox>
