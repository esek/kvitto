<script lang="ts">
	import { formatDate, toDate } from '../../helpers/date.helpers';
	import ELabel from './e-label.svelte';

	interface Props {
		value?: Date;
		placeholder?: string;
		label?: string;
		name?: string;
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
		isRequired = false,
		format = 'YYYY-MM-DD',
		className = '',
		disabled = false
	}: Props = $props();

	let internal: string = $state(formatDate(value, format));

	const output = () => (value = toDate(internal, format));

	const n = `e-date-timepicker--${name}`;
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
		/>
	{/if}
	<input hidden {name} bind:value={internal} />
</div>

<style lang="scss"></style>
