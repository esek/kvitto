<script lang="ts">
	import '../styles/main.scss';
	import ENotifications from '@components/ui/e-notifications.svelte';
	import { Home } from 'lucide-svelte';
	import EText from '@components/ui/typography/e-text.svelte';
	import EBox from '@components/ui/e-box.svelte';
	import Routes from '@/constants/routes.constants';
	import { afterNavigate } from '$app/navigation';
	import confetti from 'canvas-confetti';
	import { confettiStore } from '@/context/confetti.store';
	import { TW_BORDER_STYLE } from '@/constants/borderstyle.constants';

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

<div class="grid w-full gap-4 p-4 xl:px-64">
	<ENotifications />
	<div class="flex flex-wrap place-items-center gap-2">
		{#each data.headerItems as item}
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
