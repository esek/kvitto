<script lang="ts">
	import type { PageData } from './$types';
	import VoucherForm from '@components/kvitto/voucher-form.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import {
		FormSupplierInvoiceNames,
		FormVoucherNames,
		FormVoucherWithAttachmentNames
	} from '@/models/voucher.models';
	import EDatePicker from '@components/ui/e-date-picker.svelte';
	import AccountingTable from '@components/kvitto/accounting-table.svelte';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';

	let { data }: { data: PageData } = $props();
	let voucher = $state(data.voucher);

	let errors: Record<string, string> = $state({});
</script>

{#snippet formFields()}
	<EInput
		id={FormVoucherNames.DESCRIPTION}
		className="col-span-full"
		label="Rubrik"
		isRequired
		bind:value={voucher.description}
		isInvalid={!!errors[FormVoucherNames.DESCRIPTION]}
	/>

	<EInput
		id={FormSupplierInvoiceNames.COMPANYNAME}
		label="Företagsnamn"
		isRequired
		bind:value={voucher.supplierInvoice.companyName}
		isInvalid={!!errors[FormSupplierInvoiceNames.COMPANYNAME]}
	/>
	<EInput
		id={FormSupplierInvoiceNames.INVOICENUMBER}
		label="Fakturanummer"
		isRequired
		bind:value={voucher.supplierInvoice.invoiceNumber}
		isInvalid={!!errors[FormSupplierInvoiceNames.INVOICENUMBER]}
	/>
	<ENumericInput
		id={FormSupplierInvoiceNames.OCR}
		label="OCR-nummer"
		isRequired
		bind:value={voucher.supplierInvoice.ocr}
		isInvalid={!!errors[FormSupplierInvoiceNames.OCR]}
	/>
	<EDatePicker
		id={FormSupplierInvoiceNames.DUEDATE}
		label="Förfallodatum"
		isRequired
		bind:value={voucher.supplierInvoice.dueDate}
		isInvalid={!!errors[FormSupplierInvoiceNames.DUEDATE]}
	/>

	<EInput
		id={FormVoucherNames.REFERENCE}
		label="Namn"
		isRequired
		dropdownContent={[{ label: data.user.fullName, value: data.user.fullName }]}
		bind:value={voucher.reference}
		isInvalid={!!errors[FormVoucherNames.REFERENCE]}
	/>

	<EInput
		name={FormVoucherWithAttachmentNames.ATTACHMENT}
		label="Bilaga"
		type="file"
		accept={['image/png', 'image/jpeg', 'application/pdf', 'image/jpg']}
		isInvalid={!!errors[FormVoucherWithAttachmentNames.ATTACHMENT]}
	/>

	<AccountingTable
		className="col-span-full"
		bind:accounting={voucher.accounting}
		id={FormVoucherNames.ACCOUNTING}
		accounts={data.accounts}
		profitCenters={data.profitCenters}
		projects={data.projects}
		bind:errors
	/>
{/snippet}
<VoucherForm {formFields} bind:errors bind:voucher />
