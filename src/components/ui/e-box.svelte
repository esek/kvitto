<script lang="ts">
	import { TW_BORDER_STYLE } from '@/constants/borderstyle.constants';
	import type { Snippet } from 'svelte';

	interface Props {
		className?: string;
		padding?: boolean;
		children: Snippet<[]>;
	}

	let { className = '', padding = true, children }: Props = $props();
</script>

<div class="e-box h-fit rounded {TW_BORDER_STYLE} shadow-sm {padding ? 'p-4' : ''} {className}">
	{@render children()}
</div>
