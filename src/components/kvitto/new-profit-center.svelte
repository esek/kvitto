<script lang="ts">
	import { enhance } from '$app/forms';
	import { UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
	import { formErrors, formLoad } from '@/context/form.store';
	import { responseHandler } from '@/helpers/form.helpers';
	import { FormProfitCenterNames } from '@/models/voucher.models';
	import EInput from '@components/ui/e-input.svelte';
	import { PlusSquare } from 'lucide-svelte';

	let errors: Record<string, string> = $state({});
	formErrors.set({});
	formErrors.subscribe((e) => (errors = e));
</script>

<form
	class="relative grid grid-cols-3"
	method="post"
	action="?/add"
	onsubmit={() => formLoad.set(true)}
	use:enhance={responseHandler}
>
	<EInput
		name={FormProfitCenterNames.NAME}
		placeholder="SEK01"
		inputClasses="rounded-none rounded-l"
		isInvalid={!!errors[FormProfitCenterNames.NAME]}
	/>
	<EInput
		className="col-span-2"
		name={FormProfitCenterNames.UTSKOTT}
		inputClasses="rounded-none rounded-r"
		placeholder="Övrigt"
		dropdownContent={UTSKOTT_OPTIONS}
		isInvalid={!!errors[FormProfitCenterNames.UTSKOTT]}
	/>
	<button disabled={$formLoad}>
		<PlusSquare class="absolute -right-1 -top-1 bg-white fill-brand-success/80" />
	</button>
</form>
