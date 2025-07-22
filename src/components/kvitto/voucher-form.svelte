<script lang="ts">
	import { enhance } from '$app/forms';
	import { formErrors, formLoad } from '@/context/form.store';
	import { responseHandler } from '@/helpers/form.helpers';
	import type { VoucherType } from '@/models/voucher.models';
	import EBox from '@components/ui/e-box.svelte';
	import EButton from '@components/ui/e-button.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		voucher: VoucherType;
		errors?: Record<string, string>;
		formFields: Snippet;
	}

	let { voucher = $bindable(), errors = $bindable({}), formFields }: Props = $props();
	formErrors.set({});
	formErrors.subscribe((e) => (errors = e));
</script>

<EBox>
	<form
		class="grid gap-4 sm:grid-cols-2"
		use:enhance={responseHandler}
		method="POST"
		enctype="multipart/form-data"
		action="/vouchers?/submitVoucher"
		onsubmit={() => formLoad.set(true)}
	>
		{#key voucher}
			<input hidden name="voucher" value={JSON.stringify(voucher)} />
		{/key}
		{@render formFields()}
		<EButton disabled={$formLoad} className="ml-auto col-span-full" isSubmit>Skicka</EButton>
	</form>
</EBox>
