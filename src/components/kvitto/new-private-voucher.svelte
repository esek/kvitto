<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Account } from '@prisma/client';
	import { UTSKOTT_OPTIONS } from '../../constants/utskott.contstants';
	import EBox from '../ui/e-box.svelte';
	import EButton from '../ui/e-button.svelte';
	import EDatePicker from '../ui/e-date-picker.svelte';
	import EInput from '../ui/e-input.svelte';
	import EText from '../ui/typography/e-text.svelte';
	import WaresTable from './wares-table.svelte';
	import ENumericInput from '@components/ui/e-numeric-input.svelte';
	import type { User } from '@/models/user.models';
	import { getAccountOptionsForVouchers } from '@/helpers/voucher.helpers';
	import { FormNewPrivateVoucherNames } from '@/models/voucher.models';

	interface Props {
		accounts?: Account[];
		user?: User;
	}
	let { accounts = [], user = undefined }: Props = $props();

	const accountOptions = getAccountOptionsForVouchers(accounts);
</script>

<form class="w-1/3" use:enhance method="POST" enctype="multipart/form-data">
	<EBox className="w-fit grid grid-cols-2 gap-4">
		<EInput name={FormNewPrivateVoucherNames.NAME} label="Namn" isRequired value={user?.fullName} />
		<ENumericInput
			name={FormNewPrivateVoucherNames.SSN}
			label="Personnummer"
			isRequired
			maxDigits={12}
			placeholder="YYYYMMDDXXXX"
		/>
		<ENumericInput name={FormNewPrivateVoucherNames.CLEARINGNUM} label="Clearingnummer" />
		<ENumericInput name={FormNewPrivateVoucherNames.ACCOUNTNUM} label="Kontonummer" />
		<EText className="col-span-2 -mt-3 -mb-1" isSmall>
			Om du tidigare har lämnat in kvitton har vi denna info sparad.
		</EText>
		<EInput
			name={FormNewPrivateVoucherNames.UTSKOTT}
			label="Utskott"
			isRequired
			dropdownContent={UTSKOTT_OPTIONS}
		/>
		<EInput name={FormNewPrivateVoucherNames.DESCRIPTION} label="Projekt" isRequired />
		<EInput
			name={FormNewPrivateVoucherNames.RECEIPT}
			label="Kvitto"
			isRequired
			type="file"
			accept="image/png, image/jpeg, image/jpg"
		/>
		<EDatePicker
			name={FormNewPrivateVoucherNames.RECEIPTDATE}
			label="Datum på kvittot"
			isRequired
		/>

		<WaresTable name={FormNewPrivateVoucherNames.WARES} accounts={accountOptions} />
		<EButton isSubmit className="col-span-full ml-auto">Skicka</EButton>
	</EBox>
</form>
