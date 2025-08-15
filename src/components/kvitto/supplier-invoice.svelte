<script lang="ts">
	import VoucherEditAndPreview from './voucher-edit-and-preview.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import { FormSupplierInvoiceNames, type SupplierInvoiceType } from '@/models/voucher.models';
	import EDatePicker from '@components/ui/e-date-picker.svelte';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';
	import { getSuppliersForVouchers } from '@/helpers/voucher.helpers';
	import type { Supplier } from '@prisma/client';

	interface Props {
		supplierInvoice: SupplierInvoiceType;
		errors: Record<string, string>;
		className?: string;
		suppliers: Supplier[];
		unlockable?: boolean;
	}

	let {
		supplierInvoice = $bindable(),
		errors = $bindable(),
		className = undefined,
		suppliers,
		unlockable = true
	}: Props = $props();
	let disabled = $state(true);
</script>

{#snippet supplierInvoiceFields()}
	<EInput
		id={FormSupplierInvoiceNames.COMPANYNAME}
		label="Företagsnamn"
		isRequired
		bind:value={supplierInvoice.companyName}
		dropdownContent={getSuppliersForVouchers(suppliers)}
		isInvalid={!!errors[FormSupplierInvoiceNames.COMPANYNAME]}
		{disabled}
		ondropdownclick={(l, v) => {
			supplierInvoice.companyName = l;
			supplierInvoice.companyNumber = v.toString();
		}}
	/>
	<EInput
		id={FormSupplierInvoiceNames.INVOICENUMBER}
		label="Fakturanummer"
		isRequired
		bind:value={supplierInvoice.invoiceNumber}
		isInvalid={!!errors[FormSupplierInvoiceNames.INVOICENUMBER]}
		{disabled}
	/>

	<ENumericInput
		id={FormSupplierInvoiceNames.OCR}
		label="OCR-nummer"
		isRequired
		bind:value={supplierInvoice.ocr}
		isInvalid={!!errors[FormSupplierInvoiceNames.OCR]}
		{disabled}
	/>
	<EDatePicker
		id={FormSupplierInvoiceNames.DUEDATE}
		label="Förfallodatum"
		isRequired
		bind:value={supplierInvoice.dueDate}
		isInvalid={!!errors[FormSupplierInvoiceNames.DUEDATE]}
		{disabled}
	/>
	{#key supplierInvoice.companyName}
		<EInput
			id={FormSupplierInvoiceNames.COMPANYNUMBER}
			label="Leverantörsnummer"
			bind:value={supplierInvoice.companyNumber}
			isInvalid={!!errors[FormSupplierInvoiceNames.COMPANYNUMBER]}
			{disabled}
		/>
	{/key}
{/snippet}

<VoucherEditAndPreview
	voucherFields={supplierInvoiceFields}
	bind:locked={disabled}
	{className}
	{unlockable}
/>
