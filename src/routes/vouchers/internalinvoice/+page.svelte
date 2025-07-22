<script lang="ts">
	import type { PageData } from './$types';
	import VoucherForm from '@components/kvitto/voucher-form.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import {
		FormInternalInvoiceNames,
		FormVoucherNames,
		FormVoucherWithAttachmentNames
	} from '@/models/voucher.models';
	import { UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
	import WaresTable from '@components/kvitto/wares-table.svelte';

	let { data }: { data: PageData } = $props();
	let voucher = $state(data.voucher);

	let errors: Record<string, string> = $state({});
</script>

{#snippet formFields()}
	<EInput
		id={FormVoucherNames.DESCRIPTION}
		label="Arrangemang"
		isRequired
		bind:value={voucher.description}
		isInvalid={!!errors[FormVoucherNames.DESCRIPTION]}
	/>

	<EInput
		name={FormVoucherWithAttachmentNames.ATTACHMENT}
		label="Bilaga"
		type="file"
		accept={['image/png', 'image/jpeg', 'application/pdf', 'image/jpg']}
		isInvalid={!!errors[FormVoucherWithAttachmentNames.ATTACHMENT]}
	/>
	<EInput
		id={FormInternalInvoiceNames.SENDERNAME}
		label="Leverantör"
		isRequired
		bind:value={voucher.internalInvoice.senderName}
		isInvalid={!!errors[FormInternalInvoiceNames.SENDERNAME]}
	/>
	<EInput
		id={FormInternalInvoiceNames.SENDERUTSKOTT}
		label="Utskott (leverantör)"
		isRequired
		dropdownContent={UTSKOTT_OPTIONS}
		bind:value={voucher.internalInvoice.senderUtskott}
		isInvalid={!!errors[FormInternalInvoiceNames.SENDERUTSKOTT]}
	/>

	<EInput
		id={FormInternalInvoiceNames.RECIPIENTNAME}
		label="Mottagare"
		isRequired
		bind:value={voucher.internalInvoice.recipientName}
		isInvalid={!!errors[FormInternalInvoiceNames.RECIPIENTNAME]}
	/>
	<EInput
		id={FormVoucherNames.UTSKOTT}
		label="Utskott (mottagare)"
		isRequired
		dropdownContent={UTSKOTT_OPTIONS}
		bind:value={voucher.utskott}
		isInvalid={!!errors[FormVoucherNames.UTSKOTT]}
	/>

	<WaresTable
		bind:errors
		quantities
		id={FormInternalInvoiceNames.WARES}
		accounts={data.accounts}
		bind:wares={voucher.internalInvoice.wares}
	/>
{/snippet}
<VoucherForm {formFields} bind:errors bind:voucher />
