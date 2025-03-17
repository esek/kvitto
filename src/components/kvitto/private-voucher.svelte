<script lang="ts">
	import { enhance } from '$app/forms';
	import { UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
	import EBox from '@components/ui/e-box.svelte';
	import EDatePicker from '@components/ui/e-date-picker.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';
	import WaresTable from './wares-table.svelte';
	import {
		generateAccounting,
		getAccountOptionsForAccounting,
		getAccountOptionsForVouchers,
		getProfitCenterOptionsForAccounting,
		getProjectOptionsForAccounting
	} from '@/helpers/voucher.helpers';
	import type { Account, ProfitCenter, Project } from '@prisma/client';
	import { FormPrivateVoucherModNames, type NewPrivateVoucherMod } from '@/models/voucher.models';
	import AccountingTable from './accounting-table.svelte';
	import EButton from '@components/ui/e-button.svelte';
	import ELock from '@components/ui/e-lock.svelte';

	interface Props {
		accounts?: Account[];
		profitCenters?: ProfitCenter[];
		privateVoucher: NewPrivateVoucherMod;
		projects?: Project[];
	}
	let { accounts = [], privateVoucher, profitCenters = [], projects = [] }: Props = $props();
	let disableBaseVoucher = $state(true);
	let disableExtraInfo = $state(true);
	let waresTotalInCents = $state(0);
	let accounting = $state(privateVoucher.voucher.accounting);
	let wares = $state(privateVoucher.voucher.wares);

	const accountVoucherOptions = getAccountOptionsForVouchers(accounts);
	const accountAccountingOptions = getAccountOptionsForAccounting(accounts);
	const profitCenterOptions = getProfitCenterOptionsForAccounting(profitCenters);
	const projectOptions = getProjectOptionsForAccounting(projects);

	const generate = () => {
		const generated = generateAccounting(
			wares,
			accounts,
			profitCenters,
			privateVoucher.voucher.utskott
		);
		accounting = accounting.concat(generated);
	};
</script>

<form class="grid grid-cols-3 gap-4" use:enhance method="POST" action="updateVoucher">
	<input hidden name={FormPrivateVoucherModNames.ID} value={privateVoucher.voucher.id} />
	<EBox className="w-fit grid grid-cols-2 gap-4">
		<EInput
			name={FormPrivateVoucherModNames.NAME}
			label="Namn"
			isRequired
			value={privateVoucher.voucher.name}
			disabled={disableBaseVoucher}
		/>
		<ENumericInput
			disabled={disableBaseVoucher}
			name={FormPrivateVoucherModNames.SSN}
			label="Personnummer"
			isRequired
			maxDigits={12}
			placeholder="YYYYMMDDXXXX"
			value={Number(privateVoucher.ssn)}
		/>
		<ENumericInput
			disabled={disableBaseVoucher}
			name={FormPrivateVoucherModNames.CLEARINGNUM}
			label="Clearingnummer"
			value={Number(privateVoucher.clearingNum)}
		/>
		<ENumericInput
			name={FormPrivateVoucherModNames.ACCOUNTNUM}
			label="Kontonummer"
			value={Number(privateVoucher.accountNum)}
			disabled={disableBaseVoucher}
		/>
		<EInput
			disabled={disableBaseVoucher}
			name={FormPrivateVoucherModNames.UTSKOTT}
			label="Utskott"
			isRequired
			dropdownContent={UTSKOTT_OPTIONS}
			value={privateVoucher.voucher.utskott}
		/>
		<EInput
			name={FormPrivateVoucherModNames.DESCRIPTION}
			label="Projekt"
			isRequired
			value={privateVoucher.voucher.description}
			disabled={disableBaseVoucher}
		/>
		<!-- Bild på kvittot här typ -->
		<EDatePicker
			disabled={disableBaseVoucher}
			name={FormPrivateVoucherModNames.RECEIPTDATE}
			label="Datum på kvittot"
			isRequired
			value={privateVoucher.voucher.receiptDate}
		/>

		<WaresTable
			name={FormPrivateVoucherModNames.WARES}
			disabled={disableBaseVoucher}
			accounts={accountVoucherOptions}
			bind:wares
			bind:waresTotalInCents
		/>
		<ELock className="col-span-full ml-auto" bind:toggle={disableBaseVoucher} />
	</EBox>
	<EBox className="col-span-2 h-fit">
		<AccountingTable
			name={FormPrivateVoucherModNames.ACCOUNTING}
			accounts={accountAccountingOptions}
			wantedTotalInCents={waresTotalInCents}
			profitCenters={profitCenterOptions}
			projects={projectOptions}
			bind:accounting
			{generate}
		/>
	</EBox>

	<div class="col-span-full">
		<EButton className="ml-auto" isSubmit>Spara</EButton>
	</div>
</form>
