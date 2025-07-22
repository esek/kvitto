<script>
	import { notifications } from '../../context/notifications.store';
	import ENotification from './e-notification.svelte';
</script>

<div class="notifications-container fixed right-4 top-4 z-40 flex flex-col gap-4">
	{#each $notifications as { id, ...reduced }, idx (id)}
		<ENotification {...reduced} ondelete={() => notifications.delete(idx)} />
	{/each}
</div>

<style>
	/* your styles go here */
</style>
