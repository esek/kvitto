<script lang="ts">
	import EInput from '../ui/e-input.svelte';
	import { SquareX } from 'lucide-svelte';
	import type { IOption } from '@/models/form.models';
	import type { NewAccountingEntry } from '@/models/voucher.models';
	import CrownsAndCents from './crowns-and-cents.svelte';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';

	interface Props {
		entry: NewAccountingEntry;
		className?: string;
		accounts: IOption[];
		profitCenters?: IOption[];
		projects?: IOption[];
		disabled?: boolean;
		onchange?: () => void;
		ondelete?: () => void;
	}

	let {
		entry = $bindable({
			name: '',
			number: 0,
			profitCenterName: null,
			projectNumber: null,
			debetInCents: 0,
			kreditInCents: 0
		}),
		className = '',
		accounts = [],
		disabled = false,
		profitCenters = [],
		projects = [],
		onchange = () => {},
		ondelete = () => {}
	}: Props = $props();

	const autofillAccount = (_: string, value: number | string) => {
		entry.number = Number(value);
	};
	const autofillProjectNumber = (_: string, value: number | string) => {
		entry.projectNumber = Number(value);
	};
	let projectName = $state(projects.find((p) => p.value === entry.projectNumber)?.label ?? '');
</script>

<div class="{className} grid grid-cols-5 gap-1">
	<div class="grid grid-cols-3">
		<EInput
			className="col-span-2"
			{disabled}
			inputClasses="rounded-none rounded-l"
			oninput={onchange}
			bind:value={entry.name}
			ondropdownclick={autofillAccount}
			dropdownContent={accounts}
		/>
		{#key entry.name}
			<ENumericInput
				{disabled}
				inputClasses="rounded-none"
				oninput={onchange}
				bind:value={entry.number}
				maxDigits={4}
			/>
		{/key}
	</div>
	<EInput
		{disabled}
		inputClasses="rounded-none"
		oninput={onchange}
		bind:value={entry.profitCenterName}
		dropdownContent={profitCenters}
	/>
	<div class="grid grid-cols-3">
		<EInput
			className="col-span-2"
			{disabled}
			inputClasses="rounded-none"
			oninput={onchange}
			bind:value={projectName}
			dropdownContent={projects}
			ondropdownclick={autofillProjectNumber}
		/>
		{#key projectName}
			<ENumericInput
				{disabled}
				inputClasses="rounded-none"
				oninput={onchange}
				bind:value={entry.projectNumber}
				maxDigits={3}
			/>
		{/key}
	</div>

	<CrownsAndCents bind:totalCents={entry.debetInCents} {disabled} {onchange} />
	<div class="relative grid">
		<CrownsAndCents roundRight bind:totalCents={entry.kreditInCents} {disabled} {onchange} />
		<button {disabled} onclick={ondelete}>
			<SquareX class="absolute -right-1 -top-1 rounded bg-white fill-brand-danger/80" />
		</button>
	</div>
</div>
