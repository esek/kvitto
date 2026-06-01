<script lang="ts">
	import { LoaderCircle, Search } from 'lucide-svelte';
	import ELabel from './e-label.svelte';
	import { TW_BORDER_STYLE } from '@/constants/borderstyle.constants';

	interface Props {
		value?: number | string | null;
		placeholder?: string;
		label?: string;
		name?: string;
		id?: string;
		disabled?: boolean;
		isRequired?: boolean;
		isInvalid?: boolean;
		ref?: HTMLInputElement;
		isLoading?: boolean;
		isSearch?: boolean;
		className?: string;
		inputClasses?: string;
		maxDigits?: number;
		autocomplete?: boolean;
		helperText?: import('svelte').Snippet;
		errorText?: import('svelte').Snippet;
		oninput?: () => void;
		zfill?: number;
		allowLeadingZeros?: boolean;
	}
	let {
		value = $bindable(''),
		placeholder = undefined,
		label = undefined,
		name = undefined,
		id = undefined,
		disabled = false,
		isRequired = false,
		isInvalid = false,
		ref = undefined,
		isLoading = false,
		isSearch = false,
		className = '',
		inputClasses = '',
		maxDigits = 15,
		autocomplete = true,
		helperText,
		errorText,
		oninput = () => {},
		zfill = undefined,
		allowLeadingZeros = false
	}: Props = $props();
	value = value ? value : '';
	let internal = $state(value?.toString() ?? '');

	let zfillLen = $state(0);

	const onInput = () => {
		const candidate = value?.toString() ?? '';
		// Accept only plain digits. Anything else (decimal points, signs,
		// exponents, spaces, the macOS double-space period substitution, ...)
		// is rejected by reverting to the last valid value.
		if (/^\d*$/.test(candidate)) {
			internal = candidate;
		}
		if (allowLeadingZeros) {
			value = internal;
			zfillLen = 0;
		} else {
			internal = internal.replace(/^0+/, '');
			value = internal.padStart(zfill ?? 0, '0');
			zfillLen = value.length - internal.length;
		}
		oninput();
	};

	if (value != 0 && zfill) {
		onInput();
	}

	const n = `e-input--${name ?? id}`;
</script>

<div class="e-input-container w-full {className}">
	{#if label}
		<ELabel {label} {n} {isRequired} />
	{/if}

	<div class="relative">
		<input
			{name}
			id={n}
			bind:value
			inputmode="numeric"
			pattern="[0-9]*"
			maxlength={maxDigits + zfillLen}
			class="input form-control h-10 rounded {TW_BORDER_STYLE} p-1 {inputClasses}"
			class:border-brand-danger={isInvalid}
			class:pl-12={isSearch}
			{disabled}
			required={isRequired}
			oninput={onInput}
			{placeholder}
			bind:this={ref}
			autocomplete={autocomplete ? 'on' : 'off'}
		/>

		{#if isLoading}
			<LoaderCircle class="e-button-loading-indicator absolute right-4 top-3" />
		{/if}

		{#if isSearch}
			<Search class="absolute left-4 top-3" />
		{/if}
	</div>

	{#if helperText}
		{@render helperText()}
	{/if}

	{#if isInvalid}
		{#if errorText}
			{@render errorText()}
		{/if}
	{/if}
</div>

<style lang="scss">
</style>
