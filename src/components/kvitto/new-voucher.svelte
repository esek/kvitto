<script lang="ts">
	import { enhance } from '$app/forms';
	import { type Account } from '@prisma/client';
	import { UTSKOTT_OPTIONS } from '../../constants/utskott.contstants';
	import EBox from '../ui/e-box.svelte';
	import EButton from '../ui/e-button.svelte';
	import EDatePicker from '../ui/e-date-picker.svelte';
	import EInput from '../ui/e-input.svelte';
	import WaresTable from './wares-table.svelte';
	import type { User } from '@/models/user.models';
	import { getAccountOptionsForVouchers } from '@/helpers/voucher.helpers';
	import { FormNewVoucherNames } from '@/models/voucher.models';

	interface Props {
		accounts?: Account[];
		user?: User;
	}

	let { accounts = [], user = undefined }: Props = $props();
	const accountOptions = getAccountOptionsForVouchers(accounts);
</script>

<form class="w-1/3" use:enhance method="POST" enctype="multipart/form-data">
	<EBox className="w-fit grid grid-cols-2 gap-4">
		<EInput
			className="col-span-2"
			name={FormNewVoucherNames.NAME}
			label="Namn"
			value={user?.fullName}
			isRequired
		/>
		<EInput
			name={FormNewVoucherNames.UTSKOTT}
			label="Utskott"
			isRequired
			dropdownContent={UTSKOTT_OPTIONS}
		/>
		<EInput name={FormNewVoucherNames.DESCRIPTION} label="Projekt" isRequired />
		<EInput
			name={FormNewVoucherNames.RECEIPT}
			label="Kvitto"
			isRequired
			type="file"
			accept="image/png, image/jpeg, image/jpg"
		/>
		<EDatePicker name={FormNewVoucherNames.RECEIPTDATE} label="Datum på kvittot" isRequired />
		<WaresTable name={FormNewVoucherNames.WARES} accounts={accountOptions} />
		<EButton isSubmit className="col-span-full ml-auto">Skicka</EButton>
	</EBox>
</form>
