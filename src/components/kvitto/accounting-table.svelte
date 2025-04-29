<script lang="ts">
	import EButton from '../ui/e-button.svelte';
	import EText from '../ui/typography/e-text.svelte';
	import type { AccountingEntryType } from '@/models/voucher.models';
	import AccountingEntry from './accounting-entry.svelte';
	import SumTotal from './sum-total.svelte';
	import { defaultAccountingEntry } from '@/constants/voucher.constants';
	import type { Account, ProfitCenter, Project } from '@prisma/client';
	import {
		getAccountOptionsForAccounting,
		getProfitCenterOptionsForAccounting,
		getProjectOptionsForAccounting
	} from '@/helpers/voucher.helpers';

	interface Props {
		name: string;
		accounts: Account[];
		profitCenters: ProfitCenter[];
		projects: Project[];
		accounting: AccountingEntryType[];
		disabled?: boolean;
		wantedTotalInCents: number;
		generate?: () => void;
		className?: string;
	}

	let {
		name,
		accounts,
		profitCenters,
		projects,
		accounting = $bindable(),
		disabled = $bindable(false),
		wantedTotalInCents = $bindable(),
		generate = () => {},
		className = ''
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
		accounting.push(defaultAccountingEntry());
	};

	const deleteEntry = (i: number) => {
		accounting = accounting.filter((_, idx) => idx !== i);
		calculateTotal();
	};
	const accountOptions = getAccountOptionsForAccounting(accounts);
	const profitCenterOptions = getProfitCenterOptionsForAccounting(profitCenters);
	const projectOptions = getProjectOptionsForAccounting(projects);
</script>

<div class="{className} grid grid-cols-5 gap-1">
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
			accounts={accountOptions}
			profitCenters={profitCenterOptions}
			projects={projectOptions}
			ondelete={() => deleteEntry(i)}
			onchange={calculateTotal}
		/>
	{/each}
	<div class="col-span-3 flex gap-2">
		{#if !disabled}
			<EButton {disabled} type="secondary" onclick={addEntry}
				><EText isBold>Lägg till rad</EText></EButton
			>
			<EButton
				type="primary"
				onclick={() => {
					generate();
					calculateTotal();
				}}>Generera kontering</EButton
			>
		{/if}
	</div>
	<SumTotal text={'Debet'} totalInCents={debetTotal} {disabled} />
	<SumTotal text={'Kredit'} totalInCents={kreditTotal} {disabled} />
	<div class="col-span-4"></div>
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
