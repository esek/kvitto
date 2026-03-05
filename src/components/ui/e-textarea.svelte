<script lang="ts">
	import ELabel from './e-label.svelte';
	import { TW_BORDER_STYLE } from '@/constants/borderstyle.constants';

	interface Props {
		value?: string | number | null;
		placeholder?: string;
		label?: string;
		name?: string;
		id?: string;
		disabled?: boolean;
		isRequired?: boolean;
		isInvalid?: boolean;
		className?: string;
		oninput?: () => void;
	}
	let {
		value = $bindable(''),
		placeholder = undefined,
		label = undefined,
		name = undefined,
		id = undefined,
		disabled = false,
		isRequired = false,
		isInvalid = $bindable(false),
		oninput = () => {},
		className = ''
	}: Props = $props();

	const n = `e-textarea--${name ?? id}`;
</script>

<div class="e-textarea-container w-full {className}">
	{#if label}
		<ELabel {label} {n} {isRequired} />
	{/if}

	<textarea
		id={n}
		bind:value
		class="input form-control h-10 rounded {TW_BORDER_STYLE} p-1"
		class:border-brand-danger={isInvalid}
		{disabled}
		required={isRequired}
		{oninput}
		{placeholder}
	></textarea>
</div>

<style lang="scss">
</style>
