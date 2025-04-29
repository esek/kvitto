<script lang="ts">
	import { enhance } from '$app/forms';
	import { responseHandler } from '@/helpers/form.helpers';
	import { FormAccountNames } from '@/models/voucher.models';
	import EInput from '@components/ui/e-input.svelte';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';
	import { PlusSquare } from 'lucide-svelte';
</script>

<form class="relative grid grid-cols-5" method="post" action="?/add" use:enhance={responseHandler}>
	<ENumericInput
		name={FormAccountNames.NUMBER}
		placeholder="4001"
		inputClasses="rounded-none rounded-l"
		maxDigits={4}
	/>
	<EInput
		className="col-span-2"
		name={FormAccountNames.VOUCHERLABEL}
		inputClasses="rounded-none"
		placeholder="Mat"
	/>
	<EInput
		className="col-span-2"
		name={FormAccountNames.ACCOUNTINGLABEL}
		inputClasses="rounded-none rounded-r"
		placeholder="Kostnad Mat"
	/>
	<button>
		<PlusSquare class="absolute -right-1 -top-1 bg-white fill-brand-success/80" />
	</button>
</form>
