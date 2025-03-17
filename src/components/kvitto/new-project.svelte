<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { notifications } from '@/context/notifications.store';
	import { FormProjectNames, type NewProject } from '@/models/voucher.models';
	import EInput from '@components/ui/e-input.svelte';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';
	import { PlusSquare } from 'lucide-svelte';
</script>

<form
	class="relative grid grid-cols-3"
	method="post"
	action="?/add"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success') {
				const project = result.data?.project as NewProject;
				notifications.add('success', 'Projekt skapat!', project.number + ' | ' + project.name);
				await invalidateAll();
			} else if (result.type === 'failure') {
				if (result.data?.nameMissing) {
					notifications.add(
						'danger',
						'Inkorrekt projektnamn',
						'Inget eller felaktigt projektnamn angivet'
					);
				}
				if (result.data?.numberMissing) {
					notifications.add(
						'danger',
						'Inkorrekt projektnummer',
						'Inget eller felaktigt projektnummer angivet'
					);
				}
			}
		};
	}}
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
