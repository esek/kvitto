<script lang="ts">
	import { FormPrivateVoucherNames, FormVoucherNames } from '@/models/voucher.models';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';
	import type { PrivateVoucher } from '@prisma/client';

	interface Props {
		privateVoucher: PrivateVoucher;
		disabled?: boolean;
	}

	let { privateVoucher = $bindable(), disabled = $bindable(false) }: Props = $props();
</script>

{#key privateVoucher}
	<input name={FormVoucherNames.PRIVATEVOUCHER} value={JSON.stringify(privateVoucher)} hidden />
{/key}
<ENumericInput
	name={FormPrivateVoucherNames.SSN}
	{disabled}
	label="Personnummer"
	isRequired
	maxDigits={12}
	placeholder="YYYYMMDDXXXX"
	bind:value={privateVoucher.ssn}
/>
<ENumericInput
	name={FormPrivateVoucherNames.CLEARINGNUM}
	{disabled}
	label="Clearingnummer"
	bind:value={privateVoucher.clearingNum}
/>
<ENumericInput
	name={FormPrivateVoucherNames.ACCOUNTNUM}
	label="Kontonummer"
	bind:value={privateVoucher.accountNum}
	{disabled}
/>
