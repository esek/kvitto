<script lang="ts">
	import { Lock, Unlock } from 'lucide-svelte';
	import EButton from './e-button.svelte';

	interface Props {
		toggle: boolean;
		className?: string;
	}

	let { toggle = $bindable(false), className = '' }: Props = $props();
</script>

<EButton {className} type="secondary" onclick={() => (toggle = !toggle)}>
	{#if toggle}
		<Lock />
	{:else}
		<Unlock />
	{/if}
</EButton>
