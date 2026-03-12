<script lang="ts">
	import type { IOption } from '../../models/form.models';
	import { LoaderCircle, Search, Check } from 'lucide-svelte';
	import ELabel from './e-label.svelte';
	import { notifications } from '@/context/notifications.store';
	import { config } from '@/config.public';
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
		isValidCallback?: (v: string | number | null) => boolean,
		type?: 'text' | 'password' | 'email' | 'number' | 'phone' | 'time' | 'file';
		ref?: HTMLInputElement;
		isLoading?: boolean;
		dropdownContent?: IOption[];
		isSearch?: boolean;
		className?: string;
		inputClasses?: string;
		helperText?: import('svelte').Snippet;
		errorText?: import('svelte').Snippet;
		accept?: Array<'image/png' | 'image/jpeg' | 'application/pdf' | 'image/jpg'>;
		oninput?: () => void;
		ondropdownclick?: (label: string, value: number | string) => void;
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
		isValidCallback = (_v) => true,
		type = 'text',
		ref = undefined,
		isLoading = false,
		dropdownContent = undefined,
		isSearch = false,
		className = '',
		inputClasses = '',
		accept = undefined,
		helperText,
		errorText,
		oninput = () => {},
		ondropdownclick = (_value: number | string) => {}
	}: Props = $props();

	const inputAccept = accept?.map((item) => '.' + item.split('/').pop())?.join(',');
	const formatsAccepted = accept?.map((item) => item.split('/')[1]?.toUpperCase()).join(', ');
	value = value ?? '';
	let internal: string = $state(
		dropdownContent?.find((c) => c.value === value)?.label ?? value.toString()
	);
	let isFocused: boolean = $state(false);
	let selected = $state(false);
	let internalInvalid = $state(false)

	const setValue = (newValue: string | number, checkInvalid = false) => {
		value = newValue;
		isInvalid = !isValidCallback(value)
		const content = dropdownContent?.find((dc) => dc.value === value);
		internal = content?.label ?? value.toString();
	};

	const onInput = () => {
		selected = false;
		if (type === 'number') {
			setValue(Number(internal));
		} else {
			setValue(internal);
		}
		oninput();
	};

	const onclick = (newValue: string | number) => {
		selected = true;
		setValue(newValue);
		ondropdownclick(internal, newValue);
		ref?.blur();
	};

	const onfocus = () => {
		isFocused = true;
	};

	const onblur = () => {
		setTimeout(() => {
			isFocused = false;
		}, 100);
	};

	const handleFileUpload = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files?.length) {
			const selectedFile = input.files[0];
			if (!selectedFile) {
				return;
			}
			if (accept && !accept.some((item) => item === selectedFile.type)) {
				isInvalid = true;
				value = '';
				notifications.add('danger', 'Fel filformat', 'Tillåtna format: ' + formatsAccepted, 4000);
				return;
			}
			if (selectedFile.size > config.BODY_SIZE_LIMIT) {
				isInvalid = true;
				value = '';
				notifications.add(
					'danger',
					'För stor fil',
					'Måste vara mindre än ' + (config.BODY_SIZE_LIMIT >> 20) + 'MB', //will be wack if config.BODY_SIZE_LIMIT is not in MB range
					4000
				);
				return;
			}
			isInvalid = false;
		}
	};

	let filtered: IOption[] = $derived(
		dropdownContent
			? dropdownContent
					.filter((o) => o.label.toLowerCase().includes(internal.toLowerCase()))
					.slice(0, 12)
			: []
	);

	const n = `e-input--${name ?? id}`;
</script>

<div class="e-input-container w-full {className}">
	{#if label}
		<ELabel {label} {n} {isRequired} />
	{/if}

	<div class="relative">
		{#if type === 'file'}
			<input
				{name}
				id={n}
				bind:value
				{type}
				class="input form-control h-10 rounded {TW_BORDER_STYLE} p-1 {inputClasses}"
				class:border-brand-danger={isInvalid}
				class:pl-12={isSearch}
				{disabled}
				required={isRequired}
				{oninput}
				{placeholder}
				bind:this={ref}
				{onfocus}
				{onblur}
				onchange={handleFileUpload}
				autocomplete={dropdownContent?.length ? 'off' : 'on'}
				accept={inputAccept}
			/>
		{:else}
			<input
				id={n}
				bind:value={internal}
				{type}
				class="input form-control h-10 rounded {TW_BORDER_STYLE} p-1 {inputClasses}"
				class:border-brand-danger={isInvalid}
				class:pl-12={isSearch}
				{disabled}
				required={isRequired}
				oninput={onInput}
				{placeholder}
				bind:this={ref}
				{onfocus}
				{onblur}
				autocomplete={dropdownContent?.length ? 'off' : 'on'}
				pattern={isInvalid ? "thispatternwillnevermatch" : undefined}
			/>
			<input hidden {id} {name} bind:value {type} />
		{/if}

		{#if isLoading}
			<LoaderCircle class="e-button-loading-indicator absolute right-4 top-3" />
		{/if}

		{#if isSearch}
			<Search class="absolute left-4 top-3" />
		{/if}

		{#if filtered?.length}
			<div
				class="absolute left-0 z-10 min-w-full origin-top scale-y-0 rounded-md {TW_BORDER_STYLE} bg-white shadow-md transition-all dark:bg-gray-600"
				class:scale-y-100={isFocused}
			>
				{#each filtered as { label, value: dropdownValue } (label)}
					<button
						{disabled}
						onclick={() => onclick(dropdownValue)}
						class="flex w-full items-center gap-2 overflow-hidden text-ellipsis p-4 transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
						type="button"
					>
						{#if internal === label && selected}
							<span class="text-success-dark">
								<Check />
							</span>
						{/if}
						{label}
					</button>
				{/each}
			</div>
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
