<script lang="ts">
	import type { PageData } from './$types';
	import EText from '@components/ui/typography/e-text.svelte';
	import EBox from '@components/ui/e-box.svelte';
	import Project from '@components/kvitto/project.svelte';
	import NewProject from '@components/kvitto/new-project.svelte';

	let { data }: { data: PageData } = $props();
</script>

<EBox className="grid w-fit gap-2">
	<EText isBold>Projekt</EText>
	{#each data.projects as p (p)}
		<Project project={p} />
	{/each}
	<EText isBold>Lägg till projekt</EText>
	<NewProject />
</EBox>
