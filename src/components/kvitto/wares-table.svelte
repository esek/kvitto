<script lang="ts">
	import type { IOption } from '@/models/form.models';
	import EButton from '../ui/e-button.svelte';
	import EText from '../ui/typography/e-text.svelte';
	import WareEntry from './ware-entry.svelte';
	import { centsToCrownsString } from '@/helpers/voucher.helpers';
	import type { WareType } from '@/models/voucher.models';
	import { defaultWare } from '@/constants/voucher.constants';

	interface Props {
		name: string;
		accounts: IOption[];
		wares: WareType[];
		disabled?: boolean;
		waresTotalInCents?: number;
	}

	let {
		name,
		accounts,
		wares = $bindable(),
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
		wares.push(defaultWare());
	};

	const deleteWare = (i: number) => {
		wares = wares.filter((_, idx) => idx !== i);
		calculateTotal();
	};
</script>

<div class="col-span-full grid grid-cols-5 gap-2">
	<EText isBold className="col-span-3">Vara</EText>
	<div class="col-span-2 grid grid-cols-3">
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
	<div class="col-span-3">
		{#if !disabled}
			<EButton {disabled} type="secondary" onclick={addWare}
				><EText isBold>Lägg till vara</EText></EButton
			>
		{/if}
	</div>
	<div
		class="place-item-end col-span-2 flex h-fit rounded border-2 border-brand-black p-1 {disabled
			? 'bg-brand-black/10'
			: ''}"
	>
		<EText isBold>Total</EText>
		<EText className="pl-1 ml-auto truncate text-clip"
			>{centsToCrownsString(waresTotalInCents)}</EText
		>
	</div>
</div>
