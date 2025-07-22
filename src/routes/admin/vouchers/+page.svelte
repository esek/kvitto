<script lang="ts">
	import { UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
	import type { PageData } from './$types';
	import VoucherList from '@components/kvitto/voucher-list.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import { SquareX } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="grid auto-rows-min gap-4 md:grid-cols-3">
	<div class="relative col-span-full flex">
		<EInput
			placeholder="Filtrera på utskott"
			inputClasses="h-11"
			dropdownContent={UTSKOTT_OPTIONS}
			value={data.utskott}
			ondropdownclick={async (l, v) => {
				window.location.search = `utskott=${v}`;
			}}
		></EInput>
		{#if data.utskott}
			<button
				onclick={async () => {
					window.location.search = 'all';
				}}
			>
				<SquareX class="absolute -right-1 -top-1 rounded bg-white fill-brand-danger/80" />
			</button>
		{/if}
	</div>
	<VoucherList header="Privatutlägg" color="bg-voucher-expenseClaim" items={data.expenseClaims} />
	<VoucherList header="Sektionskort" color="bg-voucher-expenseReport" items={data.expenseReports} />
	<VoucherList
		header="Internfaktura"
		color="bg-voucher-internalInvoice"
		items={data.internalInvoices}
	/>
	<VoucherList
		header="Försäljningsredovisning"
		color="bg-voucher-salesReport"
		items={data.salesReports}
	/>
	<VoucherList
		header="Körersättning"
		color="bg-voucher-driversExpense"
		items={data.driversExpenses}
	/>
	<VoucherList
		header="Bokföringsorder"
		color="bg-voucher-accountingOrder"
		items={data.accountingOrders}
	/>
	<VoucherList header="Godkänt" color="bg-voucher-accountingOrder" items={data.approved} />
</div>
