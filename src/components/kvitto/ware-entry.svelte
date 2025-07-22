<script lang="ts">
	import EInput from '../ui/e-input.svelte';
	import { SquareX } from 'lucide-svelte';
	import type { IOption } from '@/models/form.models';
	import CrownsAndCents from './crowns-and-cents.svelte';
	import { FormWareNames, type WareType } from '@/models/voucher.models';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';

	interface Props {
		ware: WareType;
		id: string;
		className?: string;
		errors?: Record<string, string>;
		accounts: IOption[];
		disabled?: boolean;
		onchange?: () => void;
		ondelete?: () => void;
		quantities?: boolean;
	}

	let {
		ware = $bindable(),
		id,
		className = '',
		errors = $bindable({}),
		accounts = [],
		disabled = false,
		onchange = () => {},
		ondelete = () => {},
		quantities = false
	}: Props = $props();

	const onChange = () => {
		ware.accountNumber = null;
		ware.suggestedAccount = null;
		onchange();
	};

	const suggestAccount = (label: string, value: number | string) => {
		const num = Number(value);
		ware.accountNumber = isNaN(num) ? null : num;
		ware.label = label;
	};
</script>

<div class="{className} grid grid-cols-5 gap-1">
	<EInput
		id={id + FormWareNames.LABEL}
		{disabled}
		className={quantities ? 'col-span-2' : 'col-span-3'}
		inputClasses="rounded-none rounded-l"
		oninput={onChange}
		bind:value={ware.label}
		ondropdownclick={suggestAccount}
		dropdownContent={accounts}
		isInvalid={!!errors[id + FormWareNames.LABEL]}
	/>

	{#if quantities}
		<ENumericInput
			id={id + FormWareNames.QUANTITY}
			{disabled}
			oninput={onChange}
			bind:value={ware.quantity}
			inputClasses="rounded-none"
			isInvalid={!!errors[id + FormWareNames.QUANTITY]}
		/>
	{/if}
	<div class="relative col-span-2 grid">
		<CrownsAndCents
			id={id + FormWareNames.UNITPRICEINCENTS}
			bind:totalCents={ware.unitPriceInCents}
			{disabled}
			roundRight
			{onchange}
		/>
		<button {disabled} onclick={ondelete} type="button">
			<SquareX class="absolute -right-1 -top-1 rounded bg-white fill-brand-danger/80" />
		</button>
	</div>
</div>
