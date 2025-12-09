<script lang="ts">
	import type { PageData } from './$types';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';

	import Form from '@components/kvitto/form.svelte';
	import { FormLedReportNames } from '@/models/voucher.models';
	import CrownsAndCents from '@components/kvitto/crowns-and-cents.svelte';
	import EText from '@components/ui/typography/e-text.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import EDatePicker from '@components/ui/e-date-picker.svelte';

	let { data }: { data: PageData } = $props();
	let errors: Record<string, string> = $state({});
	let ledreport = $state(data.ledreport);
</script>

{#snippet formFields()}
	{#key ledreport}
		<input hidden name="ledreport" value={JSON.stringify(ledreport)} />
	{/key}
	<ENumericInput
		maxDigits={1}
		id={FormLedReportNames.READINGPERIOD}
		label="Läsperiod"
		isRequired
		bind:value={ledreport.readingPeriod}
		isInvalid={!!errors[FormLedReportNames.READINGPERIOD]}
	/>
	<ENumericInput
		maxDigits={1}
		id={FormLedReportNames.READINGWEEK}
		label="Läsvecka"
		isRequired
		bind:value={ledreport.readingWeek}
		isInvalid={!!errors[FormLedReportNames.READINGWEEK]}
	/>
	<CrownsAndCents
		label="Kassaintäkt (inkl. zettleavgift)"
		id={FormLedReportNames.REGISTERTOTALINCENTS}
		roundLeft
		roundRight
		isRequired
		bind:totalCents={ledreport.registerTotalInCents}
		isInvalid={!!errors[FormLedReportNames.REGISTERTOTALINCENTS]}
	/>

	<CrownsAndCents
		label="Zettleavgift"
		id={FormLedReportNames.TRANSACTIONFEEINCENTS}
		roundLeft
		roundRight
		isRequired
		bind:totalCents={ledreport.transactionFeeInCents}
		isInvalid={!!errors[FormLedReportNames.TRANSACTIONFEEINCENTS]}
	/>

	<CrownsAndCents
		id={FormLedReportNames.PATCHESTOTALINCENTS}
		label="Intäkt Märken"
		isInvalid={!!errors[FormLedReportNames.PATCHESTOTALINCENTS]}
		bind:totalCents={ledreport.patchesTotalInCents}
		roundLeft
		roundRight
	/>
	{#key ledreport.registerTotalInCents - ledreport.patchesTotalInCents}
		<div>
			<EText>Intäkt Mat</EText>
			<CrownsAndCents
				id={FormLedReportNames.FOODTOTALINCENTS}
				totalCents={ledreport.registerTotalInCents - ledreport.patchesTotalInCents}
				roundLeft
				roundRight
				disabled
				isInvalid={!!errors[FormLedReportNames.FOODTOTALINCENTS] ||
					ledreport.registerTotalInCents - ledreport.patchesTotalInCents < 0}
			/>
		</div>
	{/key}
	<EInput
		name={FormLedReportNames.ATTACHMENT}
		label="Bilaga"
		type="file"
		accept={['image/png', 'image/jpeg', 'application/pdf', 'image/jpg']}
		isInvalid={!!errors[FormLedReportNames.ATTACHMENT]}
	/>
	<EDatePicker
		name={FormLedReportNames.TRANSACTIONDATE}
		label="Transaktionsdatum"
		bind:value={ledreport.transactionDate}
		isRequired
		isInvalid={!!errors[FormLedReportNames.TRANSACTIONDATE]}
	/>
	<EInput
		id={FormLedReportNames.COMMENT}
		bind:value={ledreport.comment}
		label="Kommentar"
		isInvalid={!!errors[FormLedReportNames.COMMENT]}
	/>
{/snippet}
<Form {formFields} bind:errors action="/vouchers?/ledreport" />
