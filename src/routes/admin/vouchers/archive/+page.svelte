<script lang="ts">
	import type { PageData } from './$types';
	import VoucherList from '@components/kvitto/voucher-list.svelte';

	let { data }: { data: PageData } = $props();
</script>

<VoucherList
	colorItems
	header="Arkiverade verifikat"
	color="bg-[#575757]"
	items={data.archivedVouchers}
/>
<VoucherList
	colorItems
	header="Bokförda verifikat"
	color="bg-[#575757]"
	items={data.accountedVouchers}
/>
