<script lang="ts">
	import '../styles/main.scss';
	import ENotifications from '@components/ui/e-notifications.svelte';
	import EText from '@components/ui/typography/e-text.svelte';
	import { afterNavigate } from '$app/navigation';
	import confetti from 'canvas-confetti';
	import { confettiStore } from '@/context/confetti.store';
	import { TW_BORDER_STYLE } from '@/constants/borderstyle.constants';
	import favicon from '$lib/assets/favicon.ico';

	let { children, data } = $props();

	afterNavigate(() => {
		if (confettiStore.checkAndClear()) {
			confetti({
				particleCount: 200,
				spread: 1000
			});
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Kvitto | E-sektionen inom TLTH</title>
</svelte:head>

<div class="grid w-full gap-4 p-4 xl:px-64">
	<ENotifications />
	<div class="flex flex-wrap place-items-center gap-2">
		{#each data.headerItems as item (item)}
			{@const Icon = item.icon}
			<a
				class="flex h-10 place-items-center gap-2 rounded p-2 {TW_BORDER_STYLE}"
				title={item.label}
				href={item.href}
			>
				<Icon />
				<EText>{item.text}</EText>
			</a>
		{/each}
	</div>

	{@render children()}
</div>
