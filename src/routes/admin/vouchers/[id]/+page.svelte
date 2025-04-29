<script lang="ts">
	import Voucher from '@components/kvitto/voucher.svelte';
	import type { PageData } from './$types';
	import EBox from '@components/ui/e-box.svelte';
	import EButton from '@components/ui/e-button.svelte';
	import { enhance } from '$app/forms';
	import { Lock, Unlock } from 'lucide-svelte';
	import AccountingTable from '@components/kvitto/accounting-table.svelte';
	import { FormVoucherNames } from '@/models/voucher.models';
	import { generateAccountingForVoucher } from '@/helpers/voucher.helpers';
	import { responseHandler } from '@/helpers/form.helpers';
	let { data }: { data: PageData } = $props();
	let voucher = $state(data.voucher);
	let disabled = $state(true);
	let wantedTotalInCents = $state(0);

	const generateAccounting = () => {
		voucher = generateAccountingForVoucher(voucher, data.profitCenters, data.accounts);
	};
</script>

<form
	class="grid grid-cols-3 gap-4"
	use:enhance={responseHandler}
	method="POST"
	enctype="multipart/form-data"
>
	<EBox className="grid gap-2">
		<Voucher
			bind:voucher
			accounts={data.accounts}
			bind:disabled
			bind:waresTotalInCents={wantedTotalInCents}
		/>
		<EButton className="ml-auto" type="secondary" onclick={() => (disabled = !disabled)}>
			{#if disabled}
				<Lock />
			{:else}
				<Unlock />
			{/if}
		</EButton>
	</EBox>
	<div class="col-span-2 grid auto-rows-min gap-4">
		<EBox className="h-fit">
			<AccountingTable
				bind:accounting={voucher.accounting}
				bind:wantedTotalInCents
				name={FormVoucherNames.ACCOUNTING}
				accounts={data.accounts}
				profitCenters={data.profitCenters}
				projects={data.projects}
				generate={generateAccounting}
			/>
		</EBox>
		<div>
			<EButton className="ml-auto" isSubmit>Spara</EButton>
		</div>
	</div>
	<EBox>
		<img src={voucher.receiptUrl} alt="/favicon.png" />
	</EBox>
</form>
