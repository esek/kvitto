<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import EText from './typography/e-text.svelte';

	interface Props {
		type: 'success' | 'danger' | 'warning';
		title?: string;
		message?: string;
		timeout?: number;
		ondelete: () => void;
	}

	let { type, title = undefined, message = undefined, timeout = 2000, ondelete }: Props = $props();

	/** Dispatch remove event after timeout */
	onMount(() => {
		setTimeout(() => {
			ondelete();
		}, timeout);
	});
</script>

<div
	transition:fly={{ y: -20 }}
	class="flex overflow-hidden rounded-lg bg-white drop-shadow-md dark:bg-gray-800 dark:text-white"
>
	<div
		class="w-4"
		class:bg-success-dark={type === 'success'}
		class:bg-warning-dark={type === 'warning'}
		class:bg-danger-dark={type === 'danger'}
	></div>
	<div class="flex flex-col py-2 pl-4 pr-10">
		{#if title}
			<EText isBold>{title}</EText>
		{/if}

		{#if message}
			<span class="text-primary text-sm dark:text-gray-200">{message}</span>
		{/if}
	</div>
</div>

<style></style>
