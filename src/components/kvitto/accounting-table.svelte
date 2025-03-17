<script lang="ts">
	import type { IOption } from '@/models/form.models';
	import EButton from '../ui/e-button.svelte';
	import EText from '../ui/typography/e-text.svelte';
	import type { NewAccountingEntry } from '@/models/voucher.models';
	import AccountingEntry from './accounting-entry.svelte';
	import SumTotal from './sum-total.svelte';

	interface Props {
		name: string;
		accounts: IOption[];
		profitCenters: IOption[];
		projects: IOption[];
		accounting?: NewAccountingEntry[];
		disabled?: boolean;
		wantedTotalInCents: number;
		generate?: () => void;
	}

	let {
		name,
		accounts,
		profitCenters,
		projects,
		accounting = $bindable([]),
		disabled = $bindable(false),
		wantedTotalInCents,
		generate = () => {}
	}: Props = $props();
	let debetTotal = $state(0);
	let kreditTotal = $state(0);
	const calculateTotal = () => {
		debetTotal = 0;
		kreditTotal = 0;
		accounting.forEach((a) => {
			debetTotal += a.debetInCents;
			kreditTotal += a.kreditInCents;
		});
	};
	calculateTotal();

	const addEntry = () => {
		accounting.push({
			name: '',
			number: 0,
			profitCenterName: null,
			projectNumber: null,
			debetInCents: 0,
			kreditInCents: 0
		});
	};

	const deleteEntry = (i: number) => {
		accounting = accounting.filter((_, idx) => idx !== i);
		calculateTotal();
	};
</script>

<div class="col-span-full grid grid-cols-5 gap-1">
	<div class="grid grid-cols-3 gap-1">
		<EText isBold className="col-span-2">Benämning</EText>
		<EText isBold>Konto</EText>
	</div>
	<EText isBold>Kostnadsställe</EText>
	<div class="grid grid-cols-3 gap-1">
		<EText isBold className="col-span-2">Projekt</EText>
		<EText isBold>Nr.</EText>
	</div>
	<EText isBold>Debet</EText>
	<EText isBold>Kredit</EText>

	{#key accounting}
		<input hidden {name} value={JSON.stringify(accounting)} />
	{/key}
	{#each accounting as entry, i (entry)}
		<AccountingEntry
			className="col-span-full"
			bind:entry={accounting[i]}
			{accounts}
			{profitCenters}
			{projects}
			ondelete={() => deleteEntry(i)}
			onchange={calculateTotal}
		/>
	{/each}
	<div class="col-span-3">
		{#if !disabled}
			<EButton {disabled} type="secondary" onclick={addEntry}
				><EText isBold>Lägg till rad</EText></EButton
			>
		{/if}
	</div>
	<SumTotal text={'Debet'} totalInCents={debetTotal} {disabled} />
	<SumTotal text={'Kredit'} totalInCents={kreditTotal} {disabled} />
	<div class="col-span-4 mt-auto">
		<EButton
			type="primary"
			onclick={() => {
				generate();
				calculateTotal();
			}}>Generera kontering</EButton
		>
	</div>
	<div class="grid gap-1">
		<SumTotal
			wantedTotalInCents={0}
			text={'Balans'}
			totalInCents={debetTotal - kreditTotal}
			{disabled}
		/>
		<SumTotal {wantedTotalInCents} text={'Total'} totalInCents={kreditTotal} {disabled} />
	</div>
</div>
