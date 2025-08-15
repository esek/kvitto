<script lang="ts">
	import type { NavbarItem } from '@/constants/navigation.constants';
	import EText from '@components/ui/typography/e-text.svelte';
	interface Props {
		className?: string;
		items?: NavbarItem[];
	}

	let { className, items = [] }: Props = $props();
</script>

<div class="{className} grid gap-3 md:grid-cols-2 xl:grid-cols-3">
	{#each items as item (item)}
		{@const Icon = item.icon}
		<a
			class="flex h-12 place-items-center gap-2 {item.color} rounded p-4 text-white"
			title={item.label}
			href={item.href}
		>
			<Icon />
			<EText className="text-white">{item.text}</EText>
		</a>
	{/each}
</div>
