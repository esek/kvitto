<script lang="ts">
	import type { PageData } from './$types';
	import EText from '@components/ui/typography/e-text.svelte';
	import { formErrors, formLoad } from '@/context/form.store';
	import { enhance } from '$app/forms';
	import { responseHandler } from '@/helpers/form.helpers';
	import EInput from '@components/ui/e-input.svelte';
	import { FormProfitCenterNames } from '@/models/voucher.models';
	import { Save } from 'lucide-svelte';
	import { UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
	import { TW_BORDER_STYLE } from '@/constants/borderstyle.constants';

	let { data }: { data: PageData } = $props();
	let errors: Record<string, string> = $state({});
	formErrors.set({});
	formErrors.subscribe((e) => (errors = e));
	let profitCenters = $state(data.profitCenters);
</script>

<div class="grid gap-2">
	{#each profitCenters as pc (pc)}
		<form
			class="grid grid-cols-2 gap-2 rounded {TW_BORDER_STYLE} p-1 shadow-sm"
			method="post"
			action="?/update"
			onsubmit={() => formLoad.set(true)}
			use:enhance={responseHandler}
		>
			{#key pc.utskott}
				<input hidden name="profitCenter" value={JSON.stringify(pc)} />
			{/key}
			<div class="grid place-items-center">
				<EText isBold>{pc.name}</EText>
			</div>
			<div class="relative flex gap-4">
				{#key errors}
					<EInput
						inputClasses="h-fit "
						bind:value={pc.utskott}
						id={FormProfitCenterNames.UTSKOTT + pc.name}
						dropdownContent={UTSKOTT_OPTIONS}
						isInvalid={!!errors[FormProfitCenterNames.UTSKOTT + pc.name]}
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
