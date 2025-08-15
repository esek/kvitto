<script lang="ts">
	import type { PageData } from './$types';
	import { responseHandler } from '@/helpers/form.helpers';
	import { formErrors, formLoad } from '@/context/form.store';
	import EText from '@components/ui/typography/e-text.svelte';
	import { Save } from 'lucide-svelte';
	import EInput from '@components/ui/e-input.svelte';
	import { enhance } from '$app/forms';
	import { FormAccountNames } from '@/models/voucher.models';

	let { data }: { data: PageData } = $props();
	let errors: Record<string, string> = $state({});
	formErrors.set({});
	formErrors.subscribe((e) => (errors = e));
	let accounts = $state(data.accounts);
</script>

<div class="grid gap-2">
	{#each accounts as acc (acc)}
		<form
			class="grid grid-cols-5 gap-2 rounded border-2 border-brand-black p-1"
			method="post"
			action="?/update"
			onsubmit={() => formLoad.set(true)}
			use:enhance={responseHandler}
		>
			{#key acc.voucherLabel}
				<input hidden name="account" value={JSON.stringify(acc)} />
			{/key}
			<div class="grid place-items-center">
				<EText isBold>{acc.number}</EText>
			</div>
			<div class="col-span-2 grid place-items-center border-l-2 border-r-2 border-brand-black px-2">
				{#key errors}
					<EInput
						inputClasses="h-fit "
						bind:value={acc.voucherLabel}
						id={FormAccountNames.VOUCHERLABEL + acc.number}
						isInvalid={!!errors[FormAccountNames.VOUCHERLABEL + acc.number]}
						disabled={!data.user.isPengU}
					/>
				{/key}
			</div>
			<div class="relative col-span-2 flex gap-3">
				<div class="grid place-items-center">
					<EText>{acc.accountingLabel}</EText>
				</div>
				<button disabled={$formLoad || !data.user.isPengU}>
					<Save class="absolute -right-2 -top-2 bg-white fill-brand-success/80" />
				</button>
			</div>
		</form>
	{/each}
</div>
