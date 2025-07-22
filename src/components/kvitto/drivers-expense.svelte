<script lang="ts">
	import VoucherEditAndPreview from './voucher-edit-and-preview.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import { FormDriversExpenseNames, type DriversExpenseType } from '@/models/voucher.models';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';
	import CrownsAndCents from './crowns-and-cents.svelte';
	import EText from '@components/ui/typography/e-text.svelte';
	import { centsToCrownsString } from '@/helpers/voucher.helpers';

	interface Props {
		driversExpense: DriversExpenseType;
		errors: Record<string, string>;
		className?: string;
		totalCents?: number;
	}

	let {
		driversExpense = $bindable(),
		errors = $bindable(),
		className = undefined,
		totalCents = $bindable(0)
	}: Props = $props();
	let disabled = $state(true);
	const calculateTotalCents = () => {
		const milesCompensationInCents = driversExpense.milesCompensationInCents
			? parseInt(driversExpense.milesCompensationInCents.toString())
			: 0;
		const miles = driversExpense.miles ? parseInt(driversExpense.miles.toString()) : 0;
		const ticketPriceInCents = driversExpense.ticketPriceInCents
			? parseInt(driversExpense.ticketPriceInCents.toString())
			: 0;
		totalCents = milesCompensationInCents * miles + ticketPriceInCents;
	};
	calculateTotalCents();
</script>

{#snippet driversExpenseFields()}
	<EInput
		id={FormDriversExpenseNames.NAME}
		label="Namn"
		isRequired
		bind:value={driversExpense.name}
		isInvalid={!!errors[FormDriversExpenseNames.NAME]}
		{disabled}
	/>
	<ENumericInput
		id={FormDriversExpenseNames.SSN}
		label="Personnummer"
		maxDigits={12}
		placeholder="YYYYMMDDXXXX"
		isRequired
		bind:value={driversExpense.ssn}
		isInvalid={!!errors[FormDriversExpenseNames.SSN]}
		{disabled}
	/>
	<ENumericInput
		id={FormDriversExpenseNames.CLEARINGNUM}
		label="Clearingnummer"
		maxDigits={5}
		isRequired
		bind:value={driversExpense.clearingNum}
		isInvalid={!!errors[FormDriversExpenseNames.CLEARINGNUM]}
		{disabled}
	/>
	<ENumericInput
		id={FormDriversExpenseNames.ACCOUNTNUM}
		label="Kontonummer"
		maxDigits={10}
		isRequired
		bind:value={driversExpense.accountNum}
		isInvalid={!!errors[FormDriversExpenseNames.ACCOUNTNUM]}
		{disabled}
	/>

	<EInput
		id={FormDriversExpenseNames.DESTINATION}
		label="Resans mål"
		isRequired
		bind:value={driversExpense.destination}
		isInvalid={!!errors[FormDriversExpenseNames.DESTINATION]}
		{disabled}
	/>

	<div>
		<EText>Milersättning</EText>
		<CrownsAndCents
			id={FormDriversExpenseNames.MILESCOMPENSATIONINCENTS}
			bind:totalCents={driversExpense.milesCompensationInCents}
			roundLeft
			roundRight
			isInvalid={!!errors[FormDriversExpenseNames.MILESCOMPENSATIONINCENTS]}
			{disabled}
			onchange={calculateTotalCents}
		/>
	</div>

	<ENumericInput
		id={FormDriversExpenseNames.MILES}
		label="Antal mil"
		maxDigits={4}
		bind:value={driversExpense.miles}
		isInvalid={!!errors[FormDriversExpenseNames.MILES]}
		{disabled}
		oninput={calculateTotalCents}
	/>

	<div>
		<EText>Parkeringskostnad</EText>
		<CrownsAndCents
			id={FormDriversExpenseNames.TICKETPRICEINCENTS}
			bind:totalCents={driversExpense.ticketPriceInCents}
			roundLeft
			roundRight
			isInvalid={!!errors[FormDriversExpenseNames.TICKETPRICEINCENTS]}
			{disabled}
			onchange={calculateTotalCents}
		/>
	</div>

	<div
		class="flex h-fit w-full place-self-end rounded border-2 border-brand-black p-1 {disabled
			? 'bg-brand-black/10'
			: ''}"
	>
		<EText isBold>Total</EText>
		<EText className="pl-1 ml-auto truncate text-clip">{centsToCrownsString(totalCents)}</EText>
	</div>
{/snippet}

<VoucherEditAndPreview voucherFields={driversExpenseFields} bind:locked={disabled} {className} />
