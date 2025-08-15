<script lang="ts">
	import VoucherEditAndPreview from './voucher-edit-and-preview.svelte';
	import WaresTable from './wares-table.svelte';
	import type { IOption } from '@/models/form.models';
	import { FormSalesReportNames, type SalesReportType } from '@/models/voucher.models';
	import EText from '@components/ui/typography/e-text.svelte';
	import CrownsAndCents from './crowns-and-cents.svelte';
	import EBox from '@components/ui/e-box.svelte';

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
		bind:wantedTotalInCents={salesReport.totalSalesInCents}
	/>
	<EBox
		padding={false}
		className="col-span-full p-1 place-items-center {disabled ? 'bg-brand-black/10' : ''}"
	>
		<EText isBold>Balansering</EText>
		<div class="flex gap-1">
			<EText isBold>Varutotal:</EText>
			<EText>Totalförsäljning</EText>
		</div>
		<div class="flex gap-1">
			<EText isBold>Konteringtotal:</EText>
			<EText>Totalförsäljning + Transaktionsavgift</EText>
		</div>
	</EBox>
{/snippet}

<VoucherEditAndPreview
	voucherFields={salesReportFields}
	bind:locked={disabled}
	{className}
	{unlockable}
/>
