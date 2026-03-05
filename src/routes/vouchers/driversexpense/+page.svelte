<script lang="ts">
	import type { PageData } from './$types';
	import VoucherForm from '@components/kvitto/voucher-form.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import {
		FormDriversExpenseNames,
		FormVoucherNames,
		FormVoucherWithAttachmentNames
	} from '@/models/voucher.models';
	import { UTSKOTT_LABELS, UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';
	import CrownsAndCents from '@components/kvitto/crowns-and-cents.svelte';
	import EText from '@components/ui/typography/e-text.svelte';

	let { data }: { data: PageData } = $props();
	let voucher = $state(data.voucher);

	let errors: Record<string, string> = $state({});
	const updateLabel = () => {
		voucher.label =
			'Körersättning - ' +
			UTSKOTT_LABELS[voucher.utskott] +
			', ' +
			data.user.fullName +
			', ' +
			data.user.username;
	};
</script>

{#snippet formFields()}
	<EInput
		id={FormDriversExpenseNames.NAME}
		label="Namn"
		isRequired
		bind:value={voucher.driversExpense.name}
		isInvalid={!!errors[FormDriversExpenseNames.NAME]}
	/>

	<ENumericInput
		id={FormDriversExpenseNames.SSN}
		label="Personnummer"
		placeholder="YYYYMMDDXXXX"
		maxDigits={12}
		isRequired
		bind:value={voucher.driversExpense.ssn}
		isInvalid={!!errors[FormDriversExpenseNames.SSN]}
	/>

	<ENumericInput
		id={FormDriversExpenseNames.CLEARINGNUM}
		label="Clearingnummer"
		maxDigits={5}
		isRequired
		bind:value={voucher.driversExpense.clearingNum}
		isInvalid={!!errors[FormDriversExpenseNames.CLEARINGNUM]}
	/>

	<ENumericInput
		id={FormDriversExpenseNames.ACCOUNTNUM}
		label="Kontonummer"
		maxDigits={10}
		isRequired
		bind:value={voucher.driversExpense.accountNum}
		isInvalid={!!errors[FormDriversExpenseNames.ACCOUNTNUM]}
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
	/>
	<EInput
		id={FormDriversExpenseNames.DESTINATION}
		label="Resans mål"
		isRequired
		bind:value={voucher.driversExpense.destination}
		isInvalid={!!errors[FormDriversExpenseNames.DESTINATION]}
	/>
	<ENumericInput
		id={FormDriversExpenseNames.MILES}
		label="Antal mil"
		bind:value={voucher.driversExpense.miles}
		isInvalid={!!errors[FormDriversExpenseNames.MILES]}
	/>
	<EInput
		name={FormVoucherWithAttachmentNames.ATTACHMENT}
		label="Parkeringsbiljett"
		type="file"
		isInvalid={!!errors[FormVoucherWithAttachmentNames.ATTACHMENT]}
	/>

	<CrownsAndCents
		id={FormDriversExpenseNames.TICKETPRICEINCENTS}
		label="Parkeringskostnad"
		bind:totalCents={voucher.driversExpense.ticketPriceInCents}
		roundLeft
		roundRight
		isInvalid={!!errors[FormDriversExpenseNames.TICKETPRICEINCENTS]}
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

	<EInput
		id={FormVoucherNames.COMMENT}
		label="Kommentar"
		bind:value={voucher.comment}
		isInvalid={!!errors[FormVoucherNames.COMMENT]}
	/>
{/snippet}
<VoucherForm {formFields} bind:errors bind:voucher />
