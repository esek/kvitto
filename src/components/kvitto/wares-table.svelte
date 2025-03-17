<script lang="ts">
	import type { IOption } from '@/models/form.models';
	import EButton from '../ui/e-button.svelte';
	import EText from '../ui/typography/e-text.svelte';
	import WareEntry from './ware-entry.svelte';
	import { centsToCrownsString } from '@/helpers/voucher.helpers';
	import type { NewWare } from '@/models/voucher.models';

	interface Props {
		name: string;
		accounts: IOption[];
		wares?: NewWare[];
		disabled?: boolean;
		waresTotalInCents?: number;
	}

	let {
		name,
		accounts,
		wares = $bindable([{ label: '', costInCents: 0, suggestedAccountId: null }]),
		disabled = $bindable(false),
		waresTotalInCents = $bindable(0)
	}: Props = $props();

	const calculateTotal = () => {
		waresTotalInCents = 0;
		wares.forEach((w) => {
			waresTotalInCents += w.costInCents;
		});
	};
	calculateTotal();

	const addWare = () => {
		wares.push({ label: '', costInCents: 0, suggestedAccountId: null });
	};

	const deleteWare = (i: number) => {
		wares = wares.filter((_, idx) => idx !== i);
		calculateTotal();
	};
</script>

<div class="col-span-full grid grid-cols-3 gap-1">
	<EText isBold className="col-span-2">Vara</EText>
	<div class="grid grid-cols-3">
		<EText isBold className="col-span-2">Kronor</EText>
		<EText isBold>Ören</EText>
	</div>

	{#key wares}
		<input hidden {name} value={JSON.stringify(wares)} />
	{/key}
	{#each wares as ware, i (ware)}
		<WareEntry
			{disabled}
			className="col-span-full"
			bind:ware={wares[i]}
			onchange={calculateTotal}
			ondelete={() => deleteWare(i)}
			{accounts}
		/>
	{/each}
	<div class="col-span-2">
		{#if !disabled}
			<EButton {disabled} type="secondary" onclick={addWare}
				><EText isBold>Lägg till vara</EText></EButton
			>
		{/if}
	</div>
	<div
		class="place-item-end flex h-fit rounded border-2 border-brand-black p-1 {disabled
			? 'bg-brand-black/10'
			: ''}"
	>
		<EText isBold>Total</EText>
		<EText className="pl-1 ml-auto truncate text-clip"
			>{centsToCrownsString(waresTotalInCents)}</EText
		>
	</div>
</div>
