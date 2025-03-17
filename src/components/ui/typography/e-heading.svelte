<script lang="ts">
	import type { HeadingType } from '../../../models/typography.models';

	interface Props {
		as?: HeadingType;
		isLarge?: boolean;
		isSmall?: boolean;
		isBold?: boolean;
		flex?: boolean;
		isSecondary?: boolean;
		className?: string;
		children?: import('svelte').Snippet;
	}

	let {
		as = 'h2',
		isLarge = false,
		isSmall = false,
		isBold = true,
		flex = false,
		isSecondary = false,
		className = '',
		children
	}: Props = $props();

	const classes = `break-words ${flex ? 'flex gap-1' : ''} ${className} ${
		isSecondary ? 'text-secondary-light dark:text-secondary-dark' : 'text-black dark:text-white'
	}`;
</script>

{#if as === 'h1'}
	<h1
		class={classes}
		class:text-3xl={!isLarge && !isSmall}
		class:font-bold={isBold}
		class:font-medium={!isBold}
		class:text-6xl={isLarge}
		class:text-xl={isSmall}
	>
		{@render children?.()}
	</h1>
{:else if as === 'h2'}
	<h2
		class={classes}
		class:text-xl={!isLarge && !isSmall}
		class:font-semibold={isBold}
		class:text-3xl={isLarge}
		class:text-lg={isSmall}
	>
		{@render children?.()}
	</h2>
{:else if as === 'h3'}
	<h3 class={classes} class:font-medium={isBold} class:text-lg={isLarge} class:text-sm={isSmall}>
		{@render children?.()}
	</h3>
{:else if as === 'h4'}
	<h4 class={classes} class:font-medium={isBold} class:text-lg={isLarge} class:text-xs={isSmall}>
		{@render children?.()}
	</h4>
{/if}

<style lang="scss">
</style>
