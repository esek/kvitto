<script lang="ts">
	import EInput from '../ui/e-input.svelte';
	import { SquareX } from 'lucide-svelte';
	import type { IOption } from '@/models/form.models';
	import CrownsAndCents from './crowns-and-cents.svelte';
	import type { FormWare } from '@/models/voucher.models';

	interface Props {
		ware: FormWare;
		className?: string;
		accounts: IOption[];
		disabled?: boolean;
		onchange?: () => void;
		ondelete?: () => void;
	}

	let {
		ware = $bindable({ label: '', suggestedAccountId: null, costInCents: 0 }),
		className = '',
		accounts = [],
		disabled = false,
		onchange = () => {},
		ondelete = () => {}
	}: Props = $props();

	const suggestAccount = (label: string, value: number | string) => {
		const num = Number(value);
		ware.suggestedAccountId = isNaN(num) ? null : num;
		ware.label = label;
	};
</script>

<div class="{className} grid grid-cols-3 gap-1">
	<EInput
		{disabled}
		className="col-span-2"
		inputClasses="rounded-none rounded-l"
		oninput={onchange}
		bind:value={ware.label}
		ondropdownclick={suggestAccount}
		dropdownContent={accounts}
	/>
	<div class="relative flex">
		<CrownsAndCents bind:totalCents={ware.costInCents} {disabled} roundRight {onchange} />
		<button {disabled} onclick={ondelete}>
			<SquareX class="absolute -right-1 -top-1 rounded bg-white fill-brand-danger/80" />
		</button>
	</div>
</div>
