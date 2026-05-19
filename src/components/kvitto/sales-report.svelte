<script lang="ts">
	import VoucherEditAndPreview from './voucher-edit-and-preview.svelte';
	import WaresTable from './wares-table.svelte';
	import type { IOption } from '@/models/form.models';
	import { FormSalesReportNames, type SalesReportType } from '@/models/voucher.models';
	import CrownsAndCents from './crowns-and-cents.svelte';

	interface Props {
		salesReport: SalesReportType;
		errors: Record<string, string>;
		accounts: IOption[];
		className?: string;
		totalCents?: number;
		unlockable?: boolean;
	}

	let {
		salesReport = $bindable(),
		errors = $bindable(),
		accounts,
		className = undefined,
		totalCents = $bindable(0),
		unlockable = true
	}: Props = $props();
	let disabled = $state(true);
	const calculateTotal = () => {
		totalCents = salesReport.totalSalesInCents + salesReport.salesFeeInCents;
	};
	calculateTotal();
</script>

{#snippet salesReportFields()}
	<CrownsAndCents
		id={FormSalesReportNames.TOTALSALESINCENTS}
		label="Totalförsäljning"
		bind:totalCents={salesReport.totalSalesInCents}
		roundLeft
		roundRight
		onchange={calculateTotal}
		isInvalid={!!errors[FormSalesReportNames.TOTALSALESINCENTS]}
		{disabled}
	/>
	<CrownsAndCents
		id={FormSalesReportNames.SALESFEEINCENTS}
		label="Transaktionsavgift"
		bind:totalCents={salesReport.salesFeeInCents}
		roundLeft
		roundRight
		onchange={calculateTotal}
		isInvalid={!!errors[FormSalesReportNames.SALESFEEINCENTS]}
		{disabled}
	/>

	<WaresTable
		bind:errors
		id={FormSalesReportNames.WARES}
		{accounts}
		bind:wares={salesReport.wares}
		quantities
		{disabled}
		wantedTotalInCents={salesReport.totalSalesInCents + salesReport.salesFeeInCents}
	/>
{/snippet}

<VoucherEditAndPreview
	voucherFields={salesReportFields}
	bind:locked={disabled}
	{className}
	{unlockable}
/>
