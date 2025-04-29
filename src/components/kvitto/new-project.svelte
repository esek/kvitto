<script lang="ts">
	import { enhance } from '$app/forms';
	import { responseHandler } from '@/helpers/form.helpers';
	import { FormProjectNames, type NewProject } from '@/models/voucher.models';
	import EInput from '@components/ui/e-input.svelte';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';
	import { PlusSquare } from 'lucide-svelte';
</script>

<form
	class="relative grid grid-cols-3"
	method="post"
	action="?/add"
	use:enhance={responseHandler}
>
	<ENumericInput
		name={FormProjectNames.NUMBER}
		placeholder="69"
		inputClasses="rounded-none rounded-l"
		maxDigits={3}
	/>
	<EInput
		className="col-span-2"
		name={FormProjectNames.NAME}
		inputClasses="rounded-none"
		placeholder="Gille 3"
	/>
	<button>
		<PlusSquare class="absolute -right-1 -top-1 bg-white fill-brand-success/80" />
	</button>
</form>
