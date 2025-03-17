<script lang="ts">
	import ENotifications from '@components/ui/e-notifications.svelte';
	import '../styles/main.scss';
	let { children } = $props();
</script>

<div class="p-8">
	<ENotifications />
	{@render children()}
</div>
