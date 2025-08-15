<script lang="ts">
	import { FormExpenseClaimNames, type ExpenseClaimType } from '@/models/voucher.models';
	import VoucherEditAndPreview from './voucher-edit-and-preview.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import EDatePicker from '@components/ui/e-date-picker.svelte';
	import WaresTable from './wares-table.svelte';
	import type { IOption } from '@/models/form.models';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';

	interface Props {
		expenseClaim: ExpenseClaimType;
		errors: Record<string, string>;
		accounts: IOption[];
		className?: string;
		totalCents?: number;
		unlockable?: boolean;
	}

	let {
		expenseClaim = $bindable(),
		errors = $bindable(),
		accounts,
		className = undefined,
		totalCents = $bindable(0),
		unlockable = true
	}: Props = $props();
	let disabled = $state(true);
</script>

{#snippet expenseClaimFields()}
	<EInput
		id={FormExpenseClaimNames.NAME}
		label="Namn"
		isRequired
		bind:value={expenseClaim.name}
		isInvalid={!!errors[FormExpenseClaimNames.NAME]}
		{disabled}
	/>
	<ENumericInput
		id={FormExpenseClaimNames.SSN}
		label="Personnummer"
		maxDigits={12}
		placeholder="YYYYMMDDXXXX"
		isRequired
		bind:value={expenseClaim.ssn}
		isInvalid={!!errors[FormExpenseClaimNames.SSN]}
		{disabled}
	/>
	<ENumericInput
		id={FormExpenseClaimNames.CLEARINGNUM}
		label="Clearingnummer"
		maxDigits={5}
		isRequired
		bind:value={expenseClaim.clearingNum}
		isInvalid={!!errors[FormExpenseClaimNames.CLEARINGNUM]}
		{disabled}
	/>
	<ENumericInput
		id={FormExpenseClaimNames.ACCOUNTNUM}
		label="Kontonummer"
		maxDigits={10}
		isRequired
		bind:value={expenseClaim.accountNum}
		isInvalid={!!errors[FormExpenseClaimNames.ACCOUNTNUM]}
		{disabled}
	/>
	<EDatePicker
		id={FormExpenseClaimNames.RECEIPTDATE}
		label="Datum på kvittot"
		isRequired
		bind:value={expenseClaim.receiptDate}
		isInvalid={!!errors[FormExpenseClaimNames.RECEIPTDATE]}
		{disabled}
	/>

	<WaresTable
		bind:errors
		id={FormExpenseClaimNames.WARES}
		{accounts}
		bind:wares={expenseClaim.wares}
		{disabled}
		bind:waresTotalInCents={totalCents}
	/>
{/snippet}

<VoucherEditAndPreview
	voucherFields={expenseClaimFields}
	bind:locked={disabled}
	{className}
	{unlockable}
/>
