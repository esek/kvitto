<script lang="ts">
	import { formatDate, toDate } from '../../helpers/date.helpers';
	import ELabel from './e-label.svelte';

	interface Props {
		value: Date | null;
		placeholder?: string;
		label?: string;
		name?: string;
		id?: string;
		isInvalid?: boolean;
		isRequired?: boolean;
		format?: 'YYYY-MM-DD' | 'YYYY-MM-DDTHH:mm';
		className?: string;
		disabled?: boolean;
	}

	let {
		value = $bindable(new Date()),
		placeholder = undefined,
		label = undefined,
		name = undefined,
		id = undefined,
		isInvalid = $bindable(false),
		isRequired = false,
		format = 'YYYY-MM-DD',
		className = '',
		disabled = false
	}: Props = $props();

	let internal: string | null = $state(value ? formatDate(value, format) : null);

	const output = () => (value = toDate(internal, format));

	const n = `e-date-timepicker--${name ?? id}`;
</script>

<div class="e-date-timepicker-container w-full {className} appearance-none">
	{#if label}
		<ELabel {label} {n} {isRequired} />
	{/if}

	{#if format === 'YYYY-MM-DDTHH:mm'}
		<input
			id={n}
			{disabled}
			type="datetime-local"
			oninput={output}
			bind:value={internal}
			{placeholder}
			class="input form-control h-10 rounded border-2 border-brand-black p-1"
			class:border-brand-danger={isInvalid}
		/>
	{:else if format === 'YYYY-MM-DD'}
		<input
			id={n}
			{disabled}
			type="date"
			oninput={output}
			bind:value={internal}
			{placeholder}
			class="input form-control h-10 rounded border-2 border-brand-black p-1"
			class:border-brand-danger={isInvalid}
		/>
	{/if}
</div>

<style lang="scss"></style>
