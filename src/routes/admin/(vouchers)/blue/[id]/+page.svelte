<script lang="ts">
	import PrivateVoucher from '@components/kvitto/private-voucher.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PrivateVoucher {...data} />
