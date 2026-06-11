<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { type VoucherType } from '@/models/voucher.models';
	import VoucherList from '@components/kvitto/voucher-list.svelte';
	import EButton from '@components/ui/e-button.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import Fuse from 'fuse.js/min-basic';

	function getSortString(a: VoucherType) {
		const date = a.transactionDate ?? a.dateTurnedIn
		const number = (a.ident?.number ?? 0).toString();
		const paddedNumber = `${"0".repeat(10 - number.length)}${number}`
		return `${date.getFullYear()}${a.ident?.series ?? "A"}${paddedNumber}${date.toISOString()}`
	}

	let { data }: { data: PageData } = $props();

	const keys = ["label", "comment", "description", "utskott", "expenseReport.name", "expenseClaim.name", "supplierInvoice.companyName", "internalInvoice.senderName", "internalInvoice.recipientName", "internalInvoice.senderUtskott", "driversExpense.name", "ident.number"];
	const archivedFuse = new Fuse($state.snapshot(data.archivedVouchers), {
		keys,
		ignoreLocation: true,
		minMatchCharLength: 2,
		threshold: 0.3,
	})
	$effect(() => {
		archivedFuse.setCollection(data.archivedVouchers)
	})
	const accountedFuse = new Fuse($state.snapshot(data.accountedVouchers), {
		keys,
		ignoreLocation: true,
		minMatchCharLength: 2,
		threshold: 0.3,
	})
	$effect(() => {
		accountedFuse.setCollection(data.accountedVouchers)
	})

	let search = $state("");
</script>

<EInput label="Sök" bind:value={search} placeholder="Titel, utskott, beskrivning, inlämnare..."></EInput>

<VoucherList
	initiallyOpen={false}
	colorItems
	header="Arkiverade verifikat"
	color="bg-[#575757]"
	items={search === "" ? data.archivedVouchers : archivedFuse.search(search).map((item) => item.item)}
/>
<VoucherList
	colorItems
	header="Bokförda verifikat"
	color="bg-[#575757]"
	items={(search === "" ? data.accountedVouchers : accountedFuse.search(search).map((item) => item.item)).sort((a, b) => getSortString(a) < getSortString(b) ? 1 : -1 )}
/>

{#if !data.oldIncluded}
	<EButton onclick={() => goto("?old=true")}>
		Ladda äldre data...
	</EButton>
{/if}
