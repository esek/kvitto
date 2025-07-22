<script>
	import ERequired from './e-required.svelte';
	let { isRequired = false, label = undefined, n = undefined } = $props();
</script>

<span class="-mb-1 flex items-center gap-1">
	<label for={n} class="text-md mb-1 ml-0.5 dark:text-white">{label}</label>
	{#if isRequired}
		<ERequired />
	{/if}
</span>
