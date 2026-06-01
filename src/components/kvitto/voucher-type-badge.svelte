<script lang="ts">
	import { TW_BORDER_STYLE } from '@/constants/borderstyle.constants';
	import EText from '@components/ui/typography/e-text.svelte';

	let {
		label,
		color,
		className = ''
	}: { label: string; color: string; className?: string } = $props();
</script>

<div class="flex h-10 items-center justify-center rounded px-4 {TW_BORDER_STYLE} {color} {className}">
	<EText isBold>{label}</EText>
</div>
