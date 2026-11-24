<script lang="ts">
	import type { PageData } from './$types';
	import EText from '@components/ui/typography/e-text.svelte';
	import EBox from '@components/ui/e-box.svelte';
	import { formErrors, formLoad } from '@/context/form.store';
	import { enhance } from '$app/forms';
	import { responseHandler } from '@/helpers/form.helpers';
	import EInput from '@components/ui/e-input.svelte';
	import { FormProjectNames } from '@/models/voucher.models';
	import { Save } from 'lucide-svelte';
	import { TW_BORDER_STYLE } from '@/constants/borderstyle.constants';
	import type { IOption } from '@/models/form.models';

	let { data }: { data: PageData } = $props();
	let errors: Record<string, string> = $state({});
	formErrors.set({});
	formErrors.subscribe((e) => (errors = e));
	let projects = $state(data.projects);
	let openGroups = $state<Record<string, boolean>>({});
	const UNASSIGNED = '';

	const profitCenterOptions: IOption[] = $derived([
		...data.profitCenters.map((pc) => ({ value: pc.name, label: `${pc.name} (${pc.utskott})` })),
		{ value: UNASSIGNED, label: 'Ej tilldelad' }
	]);

	const groups = $derived.by(() => {
		const byCenter: Record<string, typeof projects> = {};
		for (const project of projects) {
			const key = project.profitCenterName ?? UNASSIGNED;
			(byCenter[key] ??= []).push(project);
		}

		const result = data.profitCenters
			.map((pc) => ({
				key: pc.name,
				label: `${pc.name} (${pc.utskott})`,
				projects: byCenter[pc.name] ?? []
			}))
			.filter((group) => group.projects.length > 0);

		const unassigned = byCenter[UNASSIGNED] ?? [];
		if (unassigned.length > 0) {
			result.push({ key: UNASSIGNED, label: 'Ej tilldelade', projects: unassigned });
		}
		return result;
	});

	const isOpen = (key: string) => openGroups[key] ?? true;
</script>

<div class="grid gap-2">
	{#each groups as group (group.key)}
		<div class="grid gap-2">
			<EBox
				padding={false}
				className="h-[48px] cursor-pointer bg-[#575757] px-2 py-[12px] place-items-center"
				onclick={() => (openGroups[group.key] = !isOpen(group.key))}
			>
				<EText isBold>
					{isOpen(group.key) ? '↓' : '→'} {group.label} ({group.projects.length})
				</EText>
			</EBox>
			{#if isOpen(group.key)}
				{#each group.projects as proj (proj.number)}
					<form
						class="grid grid-cols-5 gap-2 rounded {TW_BORDER_STYLE} p-1 shadow-sm"
						method="post"
						action="?/update"
						onsubmit={() => formLoad.set(true)}
						use:enhance={responseHandler}
					>
						{#key proj.name + (proj.profitCenterName ?? '')}
							<input hidden name="project" value={JSON.stringify(proj)} />
						{/key}
						<div class="grid place-items-center">
							<EText isBold>{proj.number}</EText>
						</div>
						<div class="relative col-span-2 flex gap-4">
							{#key errors}
								<EInput
									inputClasses="h-fit "
									bind:value={proj.name}
									id={FormProjectNames.NAME + proj.number}
									isInvalid={!!errors[FormProjectNames.NAME + proj.number]}
									disabled={!data.user.isPengU}
								/>
							{/key}
						</div>
						<div class="relative col-span-2 flex gap-4">
							{#key errors}
								<EInput
									inputClasses="h-fit "
									bind:value={proj.profitCenterName}
									id={FormProjectNames.PROFITCENTERNAME + proj.number}
									dropdownContent={profitCenterOptions}
									placeholder="Ej tilldelad"
									isInvalid={!!errors[FormProjectNames.PROFITCENTERNAME + proj.number]}
									disabled={!data.user.isPengU}
								/>
							{/key}
							<button disabled={$formLoad || !data.user.isPengU}>
								<Save class="absolute -right-2 -top-2 bg-white fill-brand-success/80" />
							</button>
						</div>
					</form>
				{/each}
			{/if}
		</div>
	{/each}
</div>
