<script lang="ts">
	import VoucherEditAndPreview from './voucher-edit-and-preview.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import { UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
	import WaresTable from './wares-table.svelte';
	import type { IOption } from '@/models/form.models';
	import { FormInternalInvoiceNames, type InternalInvoiceType } from '@/models/voucher.models';

	interface Props {
		internalInvoice: InternalInvoiceType;
		errors: Record<string, string>;
		accounts: IOption[];
		className?: string;
		totalCents?: number;
	}

	let {
		internalInvoice = $bindable(),
		errors = $bindable(),
		accounts,
		className = undefined,
		totalCents = $bindable(0)
	}: Props = $props();
	let disabled = $state(true);
</script>

{#snippet internalInvoiceFields()}
	<EInput
		id={FormInternalInvoiceNames.SENDERNAME}
		label="Leverantör"
		isRequired
		bind:value={internalInvoice.senderName}
		isInvalid={!!errors[FormInternalInvoiceNames.SENDERNAME]}
		{disabled}
	/>
	<EInput
		id={FormInternalInvoiceNames.SENDERUTSKOTT}
		label="Utskott (Leverantör)"
		isRequired
		dropdownContent={UTSKOTT_OPTIONS}
		bind:value={internalInvoice.senderUtskott}
		isInvalid={!!errors[FormInternalInvoiceNames.SENDERUTSKOTT]}
		{disabled}
	/>

	<EInput
		id={FormInternalInvoiceNames.RECIPIENTNAME}
		label="Mottagare"
		isRequired
		bind:value={internalInvoice.recipientName}
		isInvalid={!!errors[FormInternalInvoiceNames.RECIPIENTNAME]}
		{disabled}
	/>

	<WaresTable
		bind:errors
		id={FormInternalInvoiceNames.WARES}
		{accounts}
		bind:wares={internalInvoice.wares}
		bind:waresTotalInCents={totalCents}
		{disabled}
		quantities
	/>
{/snippet}

<VoucherEditAndPreview voucherFields={internalInvoiceFields} bind:locked={disabled} {className} />
