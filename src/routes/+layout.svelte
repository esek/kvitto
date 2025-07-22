<script lang="ts">
	import '../styles/main.scss';
	import ENotifications from '@components/ui/e-notifications.svelte';
	import { ArrowLeft, Home } from 'lucide-svelte';
	import EText from '@components/ui/typography/e-text.svelte';
	import EBox from '@components/ui/e-box.svelte';
	import Routes from '@/constants/routes.constants';
	import { type Snippet } from 'svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	interface Props {
		children: Snippet;
		headerText?: string;
	}
	let { children, headerText = 'Test' }: Props = $props();

	let showBack = $state(false);

	// We dont want to show the back button if we arrived at the
	// webiste from some other origin
	let isSameOrigin = $state(false);
	beforeNavigate(() => {
		isSameOrigin = true;
	});

	afterNavigate(() => {
		const isNotHome = window.location.pathname !== Routes.Home;
		showBack = isSameOrigin && isNotHome;
	});

	function goBack() {
		history.back();
	}
</script>

<div class="grid w-full gap-4 p-4 xl:px-64">
	<ENotifications />
	<div class="flex place-items-center gap-2">
		{#if showBack}
			<button onclick={goBack} title="Tillbaka">
				<EBox padding={false} className="flex gap-2 w-fit p-2">
					<ArrowLeft />
					<EText>Tillbaka</EText>
				</EBox>
			</button>
		{/if}
		<a href={Routes.Home} title="Hem">
			<EBox padding={false} className="flex gap-2 w-fit p-2">
				<Home />
				<EText>Hem</EText>
			</EBox>
		</a>
		<EText isHuge isBold>{headerText}</EText>
	</div>

	{@render children()}
</div>
