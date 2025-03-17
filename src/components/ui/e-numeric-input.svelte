<script lang="ts">
	import { LoaderCircle, Search } from 'lucide-svelte';
	import ELabel from './e-label.svelte';

	interface Props {
		value?: number | null;
		placeholder?: string;
		label?: string;
		name?: string;
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
	}
	let {
		value = $bindable(0),
		placeholder = undefined,
		label = undefined,
		name = undefined,
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
		oninput = () => {}
	}: Props = $props();

	value = value ? value : 0;
	let internal: string = $state(!value ? '' : value.toString());
	let isFocused: boolean = $state(false);

	const setValue = (newValue: number) => {
		value = newValue;
		internal = value.toString();
	};

	const onInput = () => {
		if (internal && !isNaN(Number(internal))) {
			setValue(Number(internal));
		} else if (!internal) {
			value = 0;
		} else if (value) {
			setValue(value);
		} else {
			internal = '';
		}
		oninput();
	};

	const onfocus = () => {
		isFocused = true;
	};

	const onblur = () => {
		setTimeout(() => {
			isFocused = false;
		}, 100);
	};

	const n = `e-input--${name}`;
</script>

<div class="e-input-container w-full {className}">
	{#if label}
		<ELabel {label} {n} {isRequired} />
	{/if}

	<div class="relative">
		<input
			id={n}
			bind:value={internal}
			inputmode="numeric"
			pattern="[0-9]*"
			maxlength={maxDigits}
			class="input form-control h-10 rounded border-2 border-brand-black p-1 {inputClasses}"
			class:border-red-400={isInvalid}
			class:pl-12={isSearch}
			{disabled}
			required={isRequired}
			oninput={onInput}
			{placeholder}
			bind:this={ref}
			{onfocus}
			{onblur}
			autocomplete={autocomplete ? 'on' : 'off'}
		/>

		<input hidden {name} bind:value />

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
