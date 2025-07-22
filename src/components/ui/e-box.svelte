<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		className?: string;
		padding?: boolean;
		children: Snippet<[]>;
	}

	let { className = '', padding = true, children }: Props = $props();
</script>

<div class="e-box h-fit rounded border-2 border-brand-black {padding ? 'p-4' : ''} {className}">
	{@render children()}
</div>
