<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';

	interface Props {
		type?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'warning';
		href?: string | undefined;
		label?: string | undefined;
		isLoading?: boolean;
		isSubmit?: boolean;
		target?: string;
		rel?: string;
		className?: string;
		padding?: boolean;
		disabled?: boolean;
		formaction?: string;
		onclick?: () => void;
		children?: import('svelte').Snippet;
	}

	let {
		type = 'primary',
		href = undefined,
		label = undefined,
		isLoading = false,
		isSubmit = false,
		className = '',
		target = '',
		rel = '',
		padding = true,
		disabled = false,
		formaction,
		onclick = () => {},
		children
	}: Props = $props();
	const classes = `e-button form-control ${padding ? 'p-2' : ''} ${className}`;
</script>

{#if href}
	<a {href} class={classes} data-type={type} aria-label={label} {onclick} {target} {rel}>
		{#if isLoading}
			<LoaderCircle className="e-button-loading-indicator" />
		{/if}

		{@render children?.()}
	</a>
{:else}
	<button
		{formaction}
		{disabled}
		class={classes}
		data-type={type}
		aria-label={label}
		type={isSubmit ? 'submit' : 'button'}
		{onclick}
	>
		{#if isLoading}
			<LoaderCircle className="e-button-loading-indicator" />
		{/if}

		{@render children?.()}
	</button>
{/if}

<style lang="scss">
	@use '../../styles/keyframes';
	.e-button {
		@apply flex max-w-fit items-center justify-center gap-2 rounded-md transition-all duration-300;

		--e-btn-bg: theme('colors.brand.black');
		--e-btn-color: theme('colors.brand.gray');
		--e-btn-border: theme('colors.brand.black');
		--e-btn-hover: theme('colors.brand.black / 10%');

		background-color: var(--e-btn-bg);
		color: var(--e-btn-color);
		border: 2px solid var(--e-btn-border);
		font-weight: theme('fontWeight.medium');

		&[data-type='primary'] {
			--e-btn-bg: theme('colors.brand.black');
			--e-btn-color: theme('colors.brand.gray');
			--e-btn-border: theme('colors.brand.black');
			--e-btn-hover: theme('colors.brand.black');
		}

		&[data-type='secondary'] {
			--e-btn-bg: theme('colors.transparent');
			--e-btn-color: theme('colors.brand.black');
			--e-btn-border: theme('colors.brand.black');
		}

		&[data-type='ghost'] {
			--e-btn-bg: theme('colors.transparent');
			--e-btn-color: theme('colors.brand.black');
			--e-btn-border: theme('colors.transparent');
		}

		&[data-type='success'] {
			--e-btn-bg: theme('colors.brand.success');
			--e-btn-border: theme('colors.brand.success');
			--e-btn-hover: theme('colors.brand.success');
		}

		&[data-type='danger'] {
			--e-btn-bg: theme('colors.brand.danger');
			--e-btn-border: theme('colors.brand.danger');
			--e-btn-hover: theme('colors.brand.danger');
		}

		&[data-type='warning'] {
			--e-btn-bg: theme('colors.brand.warning');
			--e-btn-border: theme('colors.brand.warning');
			--e-btn-hover: theme('colors.brand.warning');
		}
		&:disabled {
			--e-btn-bg: theme('colors.brand.black / 10%');
		}

		&.rm-padding {
			padding: 0;
		}

		&:active:enabled {
			transform: scale(0.99);
		}

		&:hover:enabled {
			background-color: var(--e-btn-hover);
			scale: 1.025;
		}
	}

	:global(.dark .e-button[data-type='primary']) {
		--e-btn-bg: theme('colors.brand.gray');
		--e-btn-color: theme('colors.brand.black');
		--e-btn-border: theme('colors.brand.gray');
		--e-btn-hover: theme('colors.brand.gray');
	}

	:global(.dark .e-button[data-type='secondary']) {
		--e-btn-bg: theme('colors.transparent');
		--e-btn-color: theme('colors.brand.gray');
		--e-btn-border: theme('colors.brand.gray');
		--e-btn-hover: theme('colors.brand.gray / 10%');
	}

	:global(.dark .e-button[data-type='ghost']) {
		--e-btn-bg: theme('colors.transparent');
		--e-btn-color: theme('colors.brand.gray');
		--e-btn-hover: theme('colors.brand.gray / 10%');
	}

	:global(.e-button-loading-indicator) {
		fill: currentColor;
		animation: rotate 1s infinite linear;
	}
</style>
