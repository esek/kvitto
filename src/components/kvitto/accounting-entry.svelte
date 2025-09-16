<script lang="ts">
	import EInput from '../ui/e-input.svelte';
	import { SquareX } from 'lucide-svelte';
	import { FormAccountingEntryNames, type AccountingEntryType } from '@/models/voucher.models';
	import CrownsAndCents from './crowns-and-cents.svelte';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';
	import type { Account, ProfitCenter, Project } from '@prisma/client';
	import {
		getAccountOptionsForAccounting,
		getProfitCenterOptionsForAccounting,
		getProjectOptionsForAccounting
	} from '@/helpers/voucher.helpers';

	interface Props {
		entry: AccountingEntryType;
		id: string;
		className?: string;
		errors?: Record<string, string>;
		accounts: Account[];
		profitCenters?: ProfitCenter[];
		projects?: Project[];
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
		entry.account = accounts.find((a) => a.voucherLabel === value.toString()) ?? null;
		if (entry.account) {
			entry.accountNumber = entry.account.number;
			accountNumber = entry.account.number;
			accountLabel = entry.account.accountingLabel;
		}
	};
	const autofillProjectNumber = (_: string, value: number | string) => {
		entry.project = projects.find((p) => p.number === Number(value)) ?? null;
		if (entry.project) {
			projectName = entry.project.name;
			entry.projectNumber = entry.project.number;
		}
	};
	let projectName = $state(entry.project?.name ?? '');
	let accountLabel = $state(entry.account?.accountingLabel ?? '');
	let accountNumber = $state(entry.account?.number ?? 0);
</script>

<div class="{className} grid grid-cols-5 gap-1">
	<div class="grid grid-cols-3">
		{#key accountNumber}
			<EInput
				id={id + FormAccountingEntryNames.ACCOUNTNUMBER + 'name'}
				className="col-span-2"
				{disabled}
				inputClasses="rounded-none rounded-l"
				oninput={onchange}
				bind:value={accountLabel}
				ondropdownclick={autofillAccount}
				dropdownContent={getAccountOptionsForAccounting(accounts)}
				isInvalid={!!errors[id + FormAccountingEntryNames.ACCOUNTNUMBER]}
			/>
		{/key}
		{#key accountLabel}
			<ENumericInput
				id={id + FormAccountingEntryNames.ACCOUNTNUMBER}
				{disabled}
				inputClasses="rounded-none"
				oninput={() => {
					autofillAccount('', accountNumber);
					onchange();
				}}
				bind:value={accountNumber}
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
		dropdownContent={getProfitCenterOptionsForAccounting(profitCenters)}
		isInvalid={!!errors[id + FormAccountingEntryNames.PROFITCENTERNAME]}
	/>
	<div class="grid grid-cols-3">
		{#key entry.projectNumber}
			<EInput
				id={id + FormAccountingEntryNames.PROJECTNUMBER + 'name'}
				className="col-span-2"
				{disabled}
				inputClasses="rounded-none"
				oninput={onchange}
				bind:value={projectName}
				dropdownContent={getProjectOptionsForAccounting(projects)}
				ondropdownclick={autofillProjectNumber}
				isInvalid={!!errors[id + FormAccountingEntryNames.PROJECTNUMBER]}
			/>
		{/key}
		{#key projectName}
			<ENumericInput
				id={id + FormAccountingEntryNames.PROJECTNUMBER}
				{disabled}
				inputClasses="rounded-none"
				oninput={() => {
					autofillProjectNumber('', Number(entry.projectNumber));
					onchange();
				}}
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
