<script lang="ts">
	import EInput from '../ui/e-input.svelte';
	import { SquareX } from 'lucide-svelte';
	import type { IOption } from '@/models/form.models';
	import CrownsAndCents from './crowns-and-cents.svelte';
	import type { WareType } from '@/models/voucher.models';

	interface Props {
		ware: WareType;
		className?: string;
		accounts: IOption[];
		disabled?: boolean;
		onchange?: () => void;
		ondelete?: () => void;
	}

	let {
		ware = $bindable(),
		className = '',
		accounts = [],
		disabled = false,
		onchange = () => {},
		ondelete = () => {}
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
		{disabled}
		className="col-span-3"
		inputClasses="rounded-none rounded-l"
		oninput={onChange}
		bind:value={ware.label}
		ondropdownclick={suggestAccount}
		dropdownContent={accounts}
	/>
	<div class="relative col-span-2 flex">
		<CrownsAndCents bind:totalCents={ware.costInCents} {disabled} roundRight {onchange} />
		<button {disabled} onclick={ondelete} type="button">
			<SquareX class="absolute -right-2 -top-2 rounded bg-white fill-brand-danger/80" />
		</button>
	</div>
</div>
