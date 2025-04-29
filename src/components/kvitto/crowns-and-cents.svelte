<script lang="ts">
	import { crownsFromCents } from '@/helpers/voucher.helpers';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';

	interface Props {
		totalCents?: number;
		disabled?: boolean;
		className?: string;
		roundRight?: boolean;
		roundLeft?: boolean;
		onchange?: () => void;
	}

	let {
		totalCents = $bindable(0),
		disabled = false,
		className = '',
		roundRight = false,
		roundLeft = false,
		onchange = () => {}
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
		autocomplete={false}
		{disabled}
		className="col-span-2"
		bind:value={crowns}
		inputClasses="rounded-none {roundLeft ? 'rounded-l' : ''}"
		oninput={calculateTotal}
		maxDigits={6}
		placeholder="Kr"
	/>
	<ENumericInput
		autocomplete={false}
		{disabled}
		bind:value={cents}
		inputClasses="rounded-none {roundRight ? 'rounded-r' : ''}"
		maxDigits={2}
		oninput={calculateTotal}
		placeholder="Öre"
	/>
</div>
