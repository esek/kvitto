<script lang="ts">
	import type { PageData } from './$types';
	import VoucherForm from '@components/kvitto/voucher-form.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import { FormVoucherNames, FormVoucherWithAttachmentNames } from '@/models/voucher.models';
	import AccountingTable from '@components/kvitto/accounting-table.svelte';
	import { UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';

	let { data }: { data: PageData } = $props();
	let voucher = $state(data.voucher);

	let errors: Record<string, string> = $state({});
</script>

{#snippet formFields()}
	<EInput
		id={FormVoucherNames.DESCRIPTION}
		label="Rubrik"
		isRequired
		bind:value={voucher.description}
		className="col-span-full"
		isInvalid={!!errors[FormVoucherNames.DESCRIPTION]}
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
		id={FormVoucherNames.UTSKOTT}
		label="Utskott/Mottagare"
		isRequired
		dropdownContent={UTSKOTT_OPTIONS}
		bind:value={voucher.utskott}
		isInvalid={!!errors[FormVoucherNames.UTSKOTT]}
	/>

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
