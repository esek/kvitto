<script lang="ts">
	import EInput from '../ui/e-input.svelte';
	import { SquareX } from 'lucide-svelte';
	import type { IOption } from '@/models/form.models';
	import { FormAccountingEntryNames, type AccountingEntryType } from '@/models/voucher.models';
	import CrownsAndCents from './crowns-and-cents.svelte';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';

	interface Props {
		entry: AccountingEntryType;
		id: string;
		className?: string;
		errors?: Record<string, string>;
		accounts: IOption[];
		profitCenters?: IOption[];
		projects?: IOption[];
		disabled?: boolean;
		onchange?: () => void;
		ondelete?: () => void;
	}

	let {
		entry = $bindable(),
		id,
		className = '',
		errors = $bindable({}),
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
			id={id + FormAccountingEntryNames.ACCOUNTNUMBER + 'name'}
			className="col-span-2"
			{disabled}
			inputClasses="rounded-none rounded-l"
			oninput={onchange}
			bind:value={accountLabel}
			ondropdownclick={autofillAccount}
			dropdownContent={accounts}
			isInvalid={!!errors[id + FormAccountingEntryNames.ACCOUNTNUMBER]}
		/>
		{#key accountLabel}
			<ENumericInput
				id={id + FormAccountingEntryNames.ACCOUNTNUMBER}
				{disabled}
				inputClasses="rounded-none"
				oninput={onchange}
				bind:value={entry.accountNumber}
				maxDigits={4}
				isInvalid={!!errors[id + FormAccountingEntryNames.ACCOUNTNUMBER]}
			/>
		{/key}
	</div>
	<EInput
		id={id + FormAccountingEntryNames.PROFITCENTERNAME}
		{disabled}
		inputClasses="rounded-none"
		oninput={onchange}
		bind:value={entry.profitCenterName}
		dropdownContent={profitCenters}
		isInvalid={!!errors[id + FormAccountingEntryNames.PROFITCENTERNAME]}
	/>
	<div class="grid grid-cols-3">
		<EInput
			id={id + FormAccountingEntryNames.PROJECTNUMBER + 'name'}
			className="col-span-2"
			{disabled}
			inputClasses="rounded-none"
			oninput={onchange}
			bind:value={projectName}
			dropdownContent={projects}
			ondropdownclick={autofillProjectNumber}
			isInvalid={!!errors[id + FormAccountingEntryNames.PROJECTNUMBER]}
		/>
		{#key projectName}
			<ENumericInput
				id={id + FormAccountingEntryNames.PROJECTNUMBER}
				{disabled}
				inputClasses="rounded-none"
				oninput={onchange}
				bind:value={entry.projectNumber}
				isInvalid={!!errors[id + FormAccountingEntryNames.PROJECTNUMBER]}
				maxDigits={3}
			/>
		{/key}
	</div>

	<CrownsAndCents
		id={id + FormAccountingEntryNames.DEBETINCENTS}
		bind:totalCents={entry.debetInCents}
		{disabled}
		{onchange}
		isInvalid={!!errors[id + FormAccountingEntryNames.DEBETINCENTS]}
	/>
	<div class="relative grid">
		<CrownsAndCents
			id={id + FormAccountingEntryNames.KREDITINCENTS}
			roundRight
			bind:totalCents={entry.kreditInCents}
			{disabled}
			{onchange}
			isInvalid={!!errors[id + FormAccountingEntryNames.KREDITINCENTS]}
		/>
		<button {disabled} onclick={ondelete} type="button">
			<SquareX class="absolute -right-1 -top-1 rounded bg-white fill-brand-danger/80" />
		</button>
	</div>
</div>
