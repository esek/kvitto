<script lang="ts">
	import { UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
	import EDatePicker from '@components/ui/e-date-picker.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import WaresTable from './wares-table.svelte';
	import { getAccountOptionsForVouchers } from '@/helpers/voucher.helpers';
	import { type Account } from '@prisma/client';
	import { FormVoucherNames, type VoucherType } from '@/models/voucher.models';
	import PrivateVoucher from './private-voucher.svelte';

	interface Props {
		voucher: VoucherType;
		accounts?: Account[];
		disabled?: boolean;
		receiptUpload?: boolean;
		className?: string;
		waresTotalInCents?: number;
	}
	let {
		accounts = [],
		voucher = $bindable(),
		disabled = $bindable(false),
		className = '',
		receiptUpload = false,
		waresTotalInCents = $bindable(0)
	}: Props = $props();

	const accountVoucherOptions = getAccountOptionsForVouchers(accounts);
</script>

<div class="{className} grid gap-4 md:grid-cols-2">
	<input hidden name={FormVoucherNames.ID} value={voucher.id} />
	<EInput name={FormVoucherNames.NAME} label="Namn" isRequired value={voucher.name} {disabled} />
	{#if voucher.privateVoucher}
		<PrivateVoucher bind:privateVoucher={voucher.privateVoucher} bind:disabled />
	{/if}
	<EInput
		{disabled}
		name={FormVoucherNames.UTSKOTT}
		label="Utskott"
		isRequired
		dropdownContent={UTSKOTT_OPTIONS}
		value={voucher.utskott}
	/>
	<EInput
		name={FormVoucherNames.DESCRIPTION}
		label="Projekt"
		isRequired
		value={voucher.description}
		{disabled}
	/>
	{#if receiptUpload}
		<EInput {disabled} name={FormVoucherNames.RECEIPT} label="Kvitto" isRequired type="file" />
	{/if}

	<EDatePicker
		{disabled}
		name={FormVoucherNames.RECEIPTDATE}
		label="Datum på kvittot"
		isRequired
		value={voucher.receiptDate}
	/>

	<WaresTable
		name={FormVoucherNames.WARES}
		{disabled}
		accounts={accountVoucherOptions}
		bind:wares={voucher.wares}
		bind:waresTotalInCents
	/>
</div>
