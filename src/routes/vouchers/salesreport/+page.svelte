<script lang="ts">
	import type { PageData } from './$types';
	import VoucherForm from '@components/kvitto/voucher-form.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import {
		FormSalesReportNames,
		FormVoucherNames,
		FormVoucherWithAttachmentNames
	} from '@/models/voucher.models';
	import { UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
	import WaresTable from '@components/kvitto/wares-table.svelte';
	import EText from '@components/ui/typography/e-text.svelte';
	import CrownsAndCents from '@components/kvitto/crowns-and-cents.svelte';

	let { data }: { data: PageData } = $props();
	let voucher = $state(data.voucher);
	let errors: Record<string, string> = $state({});
</script>

{#snippet formFields()}
	<EInput
		className="col-span-full"
		id={FormVoucherNames.DESCRIPTION}
		label="Rubrik"
		isRequired
		bind:value={voucher.description}
		isInvalid={!!errors[FormVoucherNames.DESCRIPTION]}
	/>
	<EInput
		id={FormVoucherNames.REFERENCE}
		label="Namn"
		isRequired
		bind:value={voucher.reference}
		isInvalid={!!errors[FormVoucherNames.REFERENCE]}
	/>
	<EInput
		id={FormVoucherNames.UTSKOTT}
		label="Utskott"
		isRequired
		dropdownContent={UTSKOTT_OPTIONS}
		bind:value={voucher.utskott}
		isInvalid={!!errors[FormVoucherNames.UTSKOTT]}
	/>
	<div>
		<EText>Totalförsäljning</EText>
		<CrownsAndCents
			id={FormSalesReportNames.TOTALSALESINCENTS}
			bind:totalCents={voucher.salesReport.totalSalesInCents}
			roundLeft
			roundRight
			isInvalid={!!errors[FormSalesReportNames.TOTALSALESINCENTS]}
		/>
	</div>
	<div>
		<EText>Transaktionsavgift</EText>
		<CrownsAndCents
			id={FormSalesReportNames.SALESFEEINCENTS}
			bind:totalCents={voucher.salesReport.salesFeeInCents}
			roundLeft
			roundRight
			isInvalid={!!errors[FormSalesReportNames.SALESFEEINCENTS]}
		/>
	</div>

	<EInput
		id={FormVoucherNames.COMMENT}
		label="Kommentar"
		bind:value={voucher.comment}
		isInvalid={!!errors[FormVoucherNames.COMMENT]}
	/>
	<EInput
		name={FormVoucherWithAttachmentNames.ATTACHMENT}
		label="Bilaga"
		type="file"
		accept={['image/png', 'image/jpeg', 'application/pdf', 'image/jpg']}
		isInvalid={!!errors[FormVoucherWithAttachmentNames.ATTACHMENT]}
	/>
	<WaresTable
		bind:errors
		id={FormSalesReportNames.WARES}
		accounts={data.accounts}
		bind:wares={voucher.salesReport.wares}
		quantities
	/>
{/snippet}
<VoucherForm {formFields} bind:errors bind:voucher />
