<script lang="ts">
	import EInput from '../ui/e-input.svelte';
	import { SquareX } from 'lucide-svelte';
	import type { IOption } from '@/models/form.models';
	import type { AccountingEntryType } from '@/models/voucher.models';
	import CrownsAndCents from './crowns-and-cents.svelte';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';

	interface Props {
		entry: AccountingEntryType;
		className?: string;
		accounts: IOption[];
		profitCenters?: IOption[];
		projects?: IOption[];
		disabled?: boolean;
		onchange?: () => void;
		ondelete?: () => void;
	}

	let {
		entry = $bindable(),
		className = '',
		accounts = [],
		disabled = false,
		profitCenters = [],
		projects = [],
		onchange = () => {},
		ondelete = () => {}
	}: Props = $props();

	const autofillAccount = (_: string, value: number | string) => {
		entry.accountNumber = Number(value);
	};
	const autofillProjectNumber = (_: string, value: number | string) => {
		entry.projectNumber = Number(value);
	};
	let projectName = $state(entry.project?.name ?? '');
	let accountLabel = $state(entry.account?.accountingLabel ?? '');
</script>

<div class="{className} grid grid-cols-5 gap-1">
	<div class="grid grid-cols-3">
		<EInput
			className="col-span-2"
			{disabled}
			inputClasses="rounded-none rounded-l"
			oninput={onchange}
			bind:value={accountLabel}
			ondropdownclick={autofillAccount}
			dropdownContent={accounts}
		/>
		{#key accountLabel}
			<ENumericInput
				{disabled}
				inputClasses="rounded-none"
				oninput={onchange}
				bind:value={entry.accountNumber}
				maxDigits={4}
			/>
		{/key}
	</div>
	<EInput
		{disabled}
		inputClasses="rounded-none"
		oninput={onchange}
		bind:value={entry.profitCenterName}
		dropdownContent={profitCenters}
	/>
	<div class="grid grid-cols-3">
		<EInput
			className="col-span-2"
			{disabled}
			inputClasses="rounded-none"
			oninput={onchange}
			bind:value={projectName}
			dropdownContent={projects}
			ondropdownclick={autofillProjectNumber}
		/>
		{#key projectName}
			<ENumericInput
				{disabled}
				inputClasses="rounded-none"
				oninput={onchange}
				bind:value={entry.projectNumber}
				maxDigits={3}
			/>
		{/key}
	</div>

	<CrownsAndCents bind:totalCents={entry.debetInCents} {disabled} {onchange} />
	<div class="relative grid">
		<CrownsAndCents roundRight bind:totalCents={entry.kreditInCents} {disabled} {onchange} />
		<button {disabled} onclick={ondelete} type="button">
			<SquareX class="absolute -right-1 -top-1 rounded bg-white fill-brand-danger/80" />
		</button>
	</div>
</div>
