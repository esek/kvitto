<script lang="ts">
	import VoucherEditAndPreview from './voucher-edit-and-preview.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import EDatePicker from '@components/ui/e-date-picker.svelte';
	import WaresTable from './wares-table.svelte';
	import type { IOption } from '@/models/form.models';
	import { FormExpenseReportNames, type ExpenseReportType } from '@/models/voucher.models';

	interface Props {
		expenseReport: ExpenseReportType;
		errors: Record<string, string>;
		accounts: IOption[];
		className?: string;
		totalCents?: number;
	}

	let {
		expenseReport = $bindable(),
		errors = $bindable(),
		accounts,
		className = undefined,
		totalCents = $bindable(0)
	}: Props = $props();
	let disabled = $state(true);
</script>

{#snippet expenseReportFields()}
	<EInput
		id={FormExpenseReportNames.NAME}
		label="Namn"
		isRequired
		bind:value={expenseReport.name}
		isInvalid={!!errors[FormExpenseReportNames.NAME]}
		{disabled}
	/>
	<EDatePicker
		id={FormExpenseReportNames.RECEIPTDATE}
		label="Datum på kvittot"
		isRequired
		bind:value={expenseReport.receiptDate}
		isInvalid={!!errors[FormExpenseReportNames.RECEIPTDATE]}
		{disabled}
	/>

	<WaresTable
		bind:errors
		id={FormExpenseReportNames.WARES}
		{accounts}
		bind:wares={expenseReport.wares}
		bind:waresTotalInCents={totalCents}
		{disabled}
	/>
{/snippet}

<VoucherEditAndPreview voucherFields={expenseReportFields} bind:locked={disabled} {className} />
