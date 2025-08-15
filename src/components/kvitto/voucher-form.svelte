<script lang="ts">
	import { formErrors } from '@/context/form.store';
	import type { VoucherType } from '@/models/voucher.models';

	import type { Snippet } from 'svelte';
	import Form from './form.svelte';

	interface Props {
		voucher: VoucherType;
		errors?: Record<string, string>;
		formFields: Snippet;
	}

	let { voucher = $bindable(), errors = $bindable({}), formFields }: Props = $props();
	formErrors.set({});
	formErrors.subscribe((e) => (errors = e));
</script>

{#snippet allFields()}
	{#key voucher}
		<input hidden name="voucher" value={JSON.stringify(voucher)} />
	{/key}
	{@render formFields()}
{/snippet}

<Form formFields={allFields} bind:errors action="/vouchers?/submitVoucher" />
