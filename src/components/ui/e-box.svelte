<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';
	import EButton from './e-button.svelte';
	import EHeading from './typography/e-heading.svelte';
	import EText from './typography/e-text.svelte';

	interface Props {
		title?: string | undefined;
		titleClasses?: string | undefined;
		withCollapse?: boolean;
		withHover?: boolean;
		withPadding?: boolean;
		defaultIsCollapsed?: boolean;
		withBackgroundColor?: boolean;
		className?: string;
		oncollapse?: () => void;
		actions?: import('svelte').Snippet;
		description?: import('svelte').Snippet;
		children?: import('svelte').Snippet<[any]>;
		onclick?: () => void;
	}

	let {
		title = undefined,
		titleClasses = undefined,
		withCollapse = false,
		withHover = false,
		withPadding = true,
		defaultIsCollapsed = false,
		withBackgroundColor = true,
		className = '',
		onclick = () => {},
		oncollapse = () => {},
		actions,
		description,
		children
	}: Props = $props();

	let isCollapsed: boolean = $state(defaultIsCollapsed);

	const toggleCollapse = () => {
		oncollapse();
		onclick();
		isCollapsed = !isCollapsed;
	};
</script>

<div
	class="e-box relative {className}"
	data-hover={withHover}
	class:p-4={withPadding}
	class:with-bg={withBackgroundColor}
	class:overflow-hidden={actions}
>
	{#if title}
		<div>
			<EHeading className="pb-2 dark:text-white {titleClasses}">{title}</EHeading>
			<EText isSmall isSecondary>
				{@render description?.()}
			</EText>
		</div>
	{/if}

	{#if withCollapse}
		<div class="absolute right-0 top-4 text-2xl transition-all" class:rotate-180={isCollapsed}>
			<EButton type="ghost" className="dark:text-white" onclick={toggleCollapse}
				><ChevronDown /></EButton
			>
		</div>
	{/if}

	{@render children?.({ isCollapsed })}

	{#if actions}
		<div
			class="absolute right-0 top-0 translate-x-full transition-transform group-hover:translate-x-0 group-hover:translate-y-2"
		>
			{@render actions?.()}
		</div>
	{/if}
</div>

<style lang="scss">
	.e-box {
		@apply rounded-md shadow-sm;

		&[data-hover='true'] {
			@apply cursor-pointer transition-all;

			&:hover {
				@apply -translate-y-1 shadow-md;
			}
		}

		&.with-bg {
			@apply border border-gray-200 bg-white;
		}
	}

	:global(.dark .e-box) {
		@apply shadow-gray-50/10;

		&[data-hover='true']:hover {
			@apply shadow-white/10;
		}

		&.with-bg {
			@apply border-zinc-700 bg-zinc-800;
		}
	}
</style>
