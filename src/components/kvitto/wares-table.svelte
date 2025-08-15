<script lang="ts">
	import type { IOption } from '@/models/form.models';
	import EButton from '../ui/e-button.svelte';
	import EText from '../ui/typography/e-text.svelte';
	import WareEntry from './ware-entry.svelte';
	import { centsToCrownsString } from '@/helpers/voucher.helpers';
	import type { WareType } from '@/models/voucher.models';
	import { defaultWare } from '@/constants/voucher.constants';
	import { TW_BORDER_STYLE } from '@/constants/borderstyle.constants';

	interface Props {
		id: string;
		accounts: IOption[];
		errors?: Record<string, string>;
		wares: WareType[];
		disabled?: boolean;
		waresTotalInCents?: number;
		quantities?: boolean;
		wantedTotalInCents?: number;
		onchange?: () => void;
	}

	let {
		id,
		accounts,
		errors = $bindable({}),
		wares = $bindable(),
		disabled = $bindable(false),
		waresTotalInCents = $bindable(0),
		quantities = false,
		wantedTotalInCents = $bindable(),
		onchange = () => {}
	}: Props = $props();

	const calculateTotal = () => {
		waresTotalInCents = 0;
		wares.forEach((w) => {
			waresTotalInCents += w.unitPriceInCents * w.quantity;
		});
		onchange();
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
	<EText isBold className={quantities ? 'col-span-2' : 'col-span-3'}>Vara</EText>
	{#if quantities}
		<EText isBold className="col-span-1">Antal</EText>
	{/if}
	<div class="place-items- col-span-2 grid grid-cols-3">
		<EText isBold className="col-span-2">{quantities ? 'á-pris' : 'Kronor'}</EText>
		<!-- <EText isBold>Ören</EText> Känns onödig i och med placeholdertexten i fältet -->
	</div>

	{#each wares as ware, i (ware)}
		{#if wares[i]}
			<WareEntry
				bind:errors
				id={id + i}
				{quantities}
				{disabled}
				className="col-span-full"
				bind:ware={wares[i]}
				onchange={calculateTotal}
				ondelete={() => deleteWare(i)}
				{accounts}
			/>
		{/if}
	{/each}
	<div class="col-span-3">
		{#if !disabled}
			<EButton {disabled} type="secondary" onclick={addWare}
				><EText isBold>Lägg till vara</EText></EButton
			>
		{/if}
	</div>
	<div
		class="place-item-end col-span-2 flex h-fit rounded {TW_BORDER_STYLE} p-1 {disabled
			? 'bg-brand-black/10'
			: ''} {wantedTotalInCents && waresTotalInCents != wantedTotalInCents
			? 'bg-brand-danger/80'
			: ''}"
	>
		<EText isBold>Total</EText>
		<EText className="pl-1 ml-auto truncate text-clip"
			>{centsToCrownsString(waresTotalInCents)}</EText
		>
	</div>
</div>
