<script lang="ts">
	interface Props {
		flex?: boolean;
		isLarge?: boolean;
		isSmall?: boolean;
		isBold?: boolean;
		isSecondary?: boolean;
		isMono?: boolean;
		color?: string;
		className?: string;
		children?: import('svelte').Snippet;
	}

	let {
		flex = false,
		isLarge = false,
		isSmall = false,
		isBold = false,
		isSecondary = false,
		isMono = false,
		color = undefined,
		className = '',
		children
	}: Props = $props();

	const classes = `break-words ${flex ? 'flex gap-1' : ''} ${
		color ??
		(isSecondary ? 'text-secondary-light dark:text-secondary-dark' : 'text-black dark:text-white')
	} ${className}`;
</script>

<p
	class={classes}
	class:font-medium={isBold}
	class:text-sm={isSmall}
	class:text-lg={isLarge}
	class:font-mono={isMono}
>
	{@render children?.()}
</p>
