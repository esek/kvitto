<script lang="ts">
	import NewPrivateVoucher from '@components/kvitto/new-private-voucher.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<NewPrivateVoucher {...data} />
