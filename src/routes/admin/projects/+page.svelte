<script lang="ts">
	import type { PageData } from './$types';
	import EText from '@components/ui/typography/e-text.svelte';
	import { formErrors, formLoad } from '@/context/form.store';
	import { enhance } from '$app/forms';
	import { responseHandler } from '@/helpers/form.helpers';
	import EInput from '@components/ui/e-input.svelte';
	import { FormProjectNames } from '@/models/voucher.models';
	import { Save } from 'lucide-svelte';
	import { TW_BORDER_STYLE } from '@/constants/borderstyle.constants';

	let { data }: { data: PageData } = $props();
	let errors: Record<string, string> = $state({});
	formErrors.set({});
	formErrors.subscribe((e) => (errors = e));
	let projects = $state(data.projects);
</script>

<div class="grid gap-2">
	{#each projects as proj (proj)}
		<form
			class="grid grid-cols-4 gap-2 rounded {TW_BORDER_STYLE} p-1 shadow-sm"
			method="post"
			action="?/update"
			onsubmit={() => formLoad.set(true)}
			use:enhance={responseHandler}
		>
			{#key proj.name}
				<input hidden name="project" value={JSON.stringify(proj)} />
			{/key}
			<div class="grid place-items-center">
				<EText isBold>{proj.number}</EText>
			</div>
			<div class="relative col-span-3 flex gap-4">
				{#key errors}
					<EInput
						inputClasses="h-fit "
						bind:value={proj.name}
						id={FormProjectNames.NAME + proj.number}
						isInvalid={!!errors[FormProjectNames.NAME + proj.number]}
						disabled={!data.user.isPengU}
					/>
				{/key}
				<button disabled={$formLoad || !data.user.isPengU}>
					<Save class="absolute -right-2 -top-2 bg-white fill-brand-success/80" />
				</button>
			</div>
		</form>
	{/each}
</div>
