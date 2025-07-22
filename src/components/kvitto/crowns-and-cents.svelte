<script lang="ts">
	import { crownsFromCents } from '@/helpers/voucher.helpers';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';

	interface Props {
		id?: string;
		totalCents?: number;
		disabled?: boolean;
		className?: string;
		roundRight?: boolean;
		roundLeft?: boolean;
		isInvalid?: boolean;
		onchange?: () => void;
		isRequired?: boolean;
	}

	let {
		id = undefined,
		totalCents = $bindable(0),
		disabled = false,
		className = '',
		roundRight = false,
		roundLeft = false,
		isInvalid = $bindable(false),
		onchange = () => {},
		isRequired = false
	}: Props = $props();
	let crowns = $state(crownsFromCents(totalCents));
	let cents = $state(totalCents % 100);
	const calculateTotal = () => {
		totalCents = Number(crowns) * 100 + Number(cents);
		onchange();
	};
</script>

<div class="grid grid-cols-3 {className}">
	<ENumericInput
		id="e-crowns-{id}"
		autocomplete={false}
		{isInvalid}
		{disabled}
		className="col-span-2"
		bind:value={crowns}
		inputClasses="rounded-none {roundLeft ? 'rounded-l' : ''}"
		oninput={calculateTotal}
		maxDigits={6}
		placeholder="Kr"
		{isRequired}
	/>
	<ENumericInput
		id="e-cents-{id}"
		autocomplete={false}
		{isInvalid}
		{disabled}
		bind:value={cents}
		inputClasses="rounded-none {roundRight ? 'rounded-r' : ''}"
		maxDigits={2}
		oninput={calculateTotal}
		placeholder="Öre"
		{isRequired}
	/>
</div>
