<script lang="ts">
	import type { PageData } from './$types';
	import VoucherForm from '@components/kvitto/voucher-form.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import {
		FormExpenseClaimNames,
		FormVoucherNames,
		FormVoucherWithAttachmentNames
	} from '@/models/voucher.models';
	import { UTSKOTT_LABELS, UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
	import EDatePicker from '@components/ui/e-date-picker.svelte';
	import WaresTable from '@components/kvitto/wares-table.svelte';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';
	import { emailHelper, max50 } from '@components/kvitto/snippets.svelte';

	let { data }: { data: PageData } = $props();
	let voucher = $state(data.voucher);
	let stilID = $state(data.user.username);
	let errors: Record<string, string> = $state({});
	const updateLabel = () => {
		voucher.label =
			'Privatutlägg - ' +
			UTSKOTT_LABELS[voucher.utskott] +
			', ' +
			voucher.expenseClaim.name +
			', ' +
			stilID;
	};
</script>

{#snippet formFields()}
	<EInput
		className="col-span-full"
		id={FormExpenseClaimNames.NAME}
		label="Namn"
		isRequired
		bind:value={voucher.expenseClaim.name}
		oninput={() => updateLabel()}
		isInvalid={!!errors[FormExpenseClaimNames.NAME]}
	/>

	<EInput
		id="stilid"
		label="Stil-ID"
		isRequired
		bind:value={stilID}
		oninput={() => updateLabel()}
		isInvalid={!!errors['stilid']}
	/>

	<ENumericInput
		id={FormExpenseClaimNames.SSN}
		label="Personnummer"
		placeholder="YYYYMMDDXXXX"
		maxDigits={12}
		isRequired
		bind:value={voucher.expenseClaim.ssn}
		isInvalid={!!errors[FormExpenseClaimNames.SSN]}
	/>

	<ENumericInput
		id={FormExpenseClaimNames.CLEARINGNUM}
		label="Clearingnummer"
		maxDigits={5}
		isRequired
		allowLeadingZeros
		bind:value={voucher.expenseClaim.clearingNum}
		isInvalid={!!errors[FormExpenseClaimNames.CLEARINGNUM]}
	/>

	<ENumericInput
		id={FormExpenseClaimNames.ACCOUNTNUM}
		label="Kontonummer"
		maxDigits={10}
		isRequired
		allowLeadingZeros
		bind:value={voucher.expenseClaim.accountNum}
		isInvalid={!!errors[FormExpenseClaimNames.ACCOUNTNUM]}
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
        isValidCallback={(v) => typeof v === "number" || v === null || (v.length <= 50)}
        errorText={max50}
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
		id={FormExpenseClaimNames.RECEIPTDATE}
		label="Datum på kvittot"
		isRequired
		bind:value={voucher.expenseClaim.receiptDate}
		isInvalid={!!errors[FormExpenseClaimNames.RECEIPTDATE]}
	/>

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

	<WaresTable
		bind:errors
		id={FormExpenseClaimNames.WARES}
		accounts={data.accounts}
		bind:wares={voucher.expenseClaim.wares}
	/>
{/snippet}
<VoucherForm {formFields} bind:errors bind:voucher />
