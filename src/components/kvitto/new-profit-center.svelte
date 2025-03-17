<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
	import { notifications } from '@/context/notifications.store';
	import { FormProfitCenterNames } from '@/models/voucher.models';
	import EInput from '@components/ui/e-input.svelte';
	import { type ProfitCenter } from '@prisma/client';
	import { PlusSquare } from 'lucide-svelte';
</script>

<form
	class="relative grid grid-cols-3"
	method="post"
	action="?/add"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success') {
				const profitCenter = result.data?.profitCenter as ProfitCenter;
				notifications.add(
					'success',
					'Kostnadsställe skapat!',
					profitCenter.name + ' | ' + profitCenter.utskott
				);
				await invalidateAll();
			} else if (result.type === 'failure') {
				if (result.data?.nameMissing) {
					notifications.add('danger', 'Inkorrekt namn', 'Inget eller felaktigt namn angivet');
				}
				if (result.data?.utskottMissing) {
					notifications.add('danger', 'Inkorrekt utskott', 'Inget eller felaktigt utskott angivet');
				}
			}
		};
	}}
>
	<EInput
		name={FormProfitCenterNames.NAME}
		placeholder="SEK01"
		inputClasses="rounded-none rounded-l"
	/>
	<EInput
		className="col-span-2"
		name={FormProfitCenterNames.UTSKOTT}
		inputClasses="rounded-none rounded-r"
		placeholder="Övrigt"
		dropdownContent={UTSKOTT_OPTIONS}
	/>
	<button>
		<PlusSquare class="absolute -right-1 -top-1 bg-white fill-brand-success/80" />
	</button>
</form>
