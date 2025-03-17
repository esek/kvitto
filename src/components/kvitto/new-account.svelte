<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { notifications } from '@/context/notifications.store';
	import { FormAccountNames } from '@/models/voucher.models';
	import EInput from '@components/ui/e-input.svelte';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';
	import { type Account } from '@prisma/client';
	import { PlusSquare } from 'lucide-svelte';
</script>

<form
	class="relative grid grid-cols-5"
	method="post"
	action="?/add"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success') {
				const account = result.data?.account as Account;
				notifications.add(
					'success',
					'Konto ' + account.number + ' skapat!',
					account.voucherLabel + ' | ' + account.accountingLabel
				);
				await invalidateAll();
			} else if (result.type === 'failure') {
				if (result.data?.incorrect) {
					notifications.add(
						'danger',
						'Inkorrekt kontonummer',
						'Alla kontonummer måste bestå av fyra siffror'
					);
				}
				if (result.data?.missingVoucherLabel) {
					notifications.add(
						'danger',
						'Inkorrekt kontonamn',
						'Konton måste ha ett namn på verifikat'
					);
				}
				if (result.data?.missingAccountingLabel) {
					notifications.add(
						'danger',
						'Inkorrekt kontonamn',
						'Konton måste ha ett namn på kontering'
					);
				}
			}
		};
	}}
>
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
