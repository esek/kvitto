<script lang="ts">
	import type { PageData } from './$types';
	import VoucherForm from '@components/kvitto/voucher-form.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import {
		FormExpenseReportNames,
		FormVoucherNames,
		FormVoucherWithAttachmentNames
	} from '@/models/voucher.models';
	import { UTSKOTT_LABELS, UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
	import EDatePicker from '@components/ui/e-date-picker.svelte';
	import WaresTable from '@components/kvitto/wares-table.svelte';
	import EText from '@components/ui/typography/e-text.svelte';

	let { data }: { data: PageData } = $props();
	let voucher = $state(data.voucher);
	let errors: Record<string, string> = $state({});
	const updateLabel = () => {
		voucher.label =
			'Kvittoförstärkning - ' +
			UTSKOTT_LABELS[voucher.utskott] +
			', ' +
			data.user.fullName +
			', ' +
			data.user.username;
	};
</script>

{#snippet formFields()}
	<EInput
		id={FormExpenseReportNames.NAME}
		label="Namn"
		isRequired
		bind:value={voucher.expenseReport.name}
		isInvalid={!!errors[FormExpenseReportNames.NAME]}
	/>

	<EInput
		id={FormVoucherNames.UTSKOTT}
		label="Utskott"
		isRequired
		dropdownContent={UTSKOTT_OPTIONS}
		bind:value={voucher.utskott}
		isInvalid={!!errors[FormVoucherNames.UTSKOTT]}
		oninput={updateLabel}
		ondropdownclick={updateLabel}
	/>
	<EInput
		id={FormVoucherNames.DESCRIPTION}
		label="Beskrivning"
		isRequired
		bind:value={voucher.description}
		isInvalid={!!errors[FormVoucherNames.DESCRIPTION]}
		placeholder="Vad köpet avser t.ex. Sittning, Fika, Material etc."
	/>
	<EInput
		name={FormVoucherWithAttachmentNames.ATTACHMENT}
		label="Kvitto"
		isRequired
		type="file"
		accept={['image/png', 'image/jpeg', 'application/pdf', 'image/jpg']}
		isInvalid={!!errors[FormVoucherWithAttachmentNames.ATTACHMENT]}
	/>

	<EDatePicker
		id={FormExpenseReportNames.RECEIPTDATE}
		label="Datum på kvittot"
		isRequired
		bind:value={voucher.expenseReport.receiptDate}
		isInvalid={!!errors[FormExpenseReportNames.RECEIPTDATE]}
	/>
	<EInput
		id={FormVoucherNames.COMMENT}
		label="Kommentar"
		bind:value={voucher.comment}
		isInvalid={!!errors[FormVoucherNames.COMMENT]}
	/>
	{#snippet emailHelper()}
		<EText isSecondary>Skickar bekräftelse så du når ditt kvitto digitalt</EText>
	{/snippet}
	<EInput
		id={FormVoucherNames.REFERENCEEMAIL}
		label="Email"
		bind:value={voucher.referenceEmail}
		isInvalid={!!errors[FormVoucherNames.REFERENCEEMAIL]}
		helperText={emailHelper}
		dropdownContent={[{ label: data.user.email, value: data.user.email }]}
	/>
	<WaresTable
		bind:errors
		id={FormExpenseReportNames.WARES}
		accounts={data.accounts}
		bind:wares={voucher.expenseReport.wares}
	/>
{/snippet}
<VoucherForm {formFields} bind:errors bind:voucher />
