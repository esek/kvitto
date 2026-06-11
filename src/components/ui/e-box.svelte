<script lang="ts">
	import { TW_BORDER_STYLE } from '@/constants/borderstyle.constants';
	import type { Snippet } from 'svelte';

	interface Props {
		className?: string;
		padding?: boolean;
		onclick?: () => void;
		children: Snippet<[]>;
	}

	let { className = '', padding = true, onclick = () => {}, children }: Props = $props();
</script>

<div class="e-box h-fit rounded {TW_BORDER_STYLE} shadow-sm {padding ? 'p-4' : ''} {className}" {onclick}>
	{@render children()}
</div>
