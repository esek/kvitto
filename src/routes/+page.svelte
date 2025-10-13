<script lang="ts">
	import { NAVBAR_ITEMS } from '@/constants/navigation.constants';
	import Navbar from '@components/kvitto/navbar.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<Navbar items={NAVBAR_ITEMS.filter((item) => !item.admin || data.user.isAdmin)} />
