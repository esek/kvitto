<script lang="ts">
	import NewVoucher from '@components/kvitto/new-voucher.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<NewVoucher {...data} />
