<script lang="ts">
	import { UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
	import type { PageData } from './$types';
	import VoucherList from '@components/kvitto/voucher-list.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import { SquareX } from 'lucide-svelte';
	import Fuse from 'fuse.js/min-basic';

	let { data }: { data: PageData } = $props();

	const keys = [
		'label',
		'comment',
		'description',
		'utskott',
		'expenseReport.name',
		'expenseClaim.name',
		'supplierInvoice.companyName',
		'internalInvoice.senderName',
		'internalInvoice.recipientName',
		'internalInvoice.senderUtskott',
		'driversExpense.name',
		'ident.number'
	];

	const allVouchers = $derived([
		...data.expenseClaims,
		...data.expenseReports,
		...data.internalInvoices,
		...data.driversExpenses,
		...data.salesReports,
		...data.accountingOrders,
		...data.approved,
		...data.paid
	]);
	const voucherFuse = new Fuse($state.snapshot(allVouchers), {
		keys,
		ignoreLocation: true,
		minMatchCharLength: 2,
		threshold: 0.3
	});
	$effect(() => {
		voucherFuse.setCollection(allVouchers);
	});

	let search = $state('');
	const matchedIds = $derived(
		new Set(search === '' ? [] : voucherFuse.search(search).map((item) => item.item.id))
	);
	const filter = (items: (typeof data.expenseClaims)) =>
		search === '' ? items : items.filter((item) => matchedIds.has(item.id));

	const expenseClaims = $derived(filter(data.expenseClaims));
	const expenseReports = $derived(filter(data.expenseReports));
	const internalInvoices = $derived(filter(data.internalInvoices));
	const driversExpenses = $derived(filter(data.driversExpenses));
	const salesReports = $derived(filter(data.salesReports));
	const accountingOrders = $derived(filter(data.accountingOrders));
	const approved = $derived(filter(data.approved));
	const paid = $derived(filter(data.paid));
</script>

<div class="grid auto-rows-min gap-2 md:grid-cols-3">
	<div class="relative col-span-full flex gap-2">
		<EInput
			label="Sök"
			bind:value={search}
			placeholder="Titel, utskott, beskrivning, inlämnare..."
			inputClasses="h-11"
			isSearch
		/>
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
	<div class=" grid auto-rows-min flex-col gap-2">
		<VoucherList header="Privatutlägg" color="bg-voucher-expenseClaim" items={expenseClaims} />
		<VoucherList header="Sektionskort" color="bg-voucher-expenseReport" items={expenseReports} />
	</div>
	<div class="grid auto-rows-min flex-col gap-2">
		<VoucherList header="Körersättning" color="bg-voucher-driversExpense" items={driversExpenses} />
		<VoucherList
			header="Internfaktura"
			color="bg-voucher-internalInvoice"
			items={internalInvoices}
		/>
		<VoucherList
			header="Försäljningsredovisning"
			color="bg-voucher-salesReport"
			items={salesReports}
		/>
	</div>
	<div class="grid auto-rows-min flex-col gap-2">
		<VoucherList
			header="Bokföringsorder"
			color="bg-voucher-accountingOrder"
			items={accountingOrders}
		/>
		<VoucherList
			colorItems
			header="Godkänt"
			color="bg-voucher-accountingOrder"
			items={approved}
		/>
		<VoucherList colorItems header="Betalda" color="bg-voucher-accountingOrder" items={paid} />
	</div>
</div>
