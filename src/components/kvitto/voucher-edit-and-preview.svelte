<script lang="ts">
	import EBox from '@components/ui/e-box.svelte';
	import EButton from '@components/ui/e-button.svelte';
	import { Lock, Unlock } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		locked?: boolean;
		className?: string;
		voucherFields: Snippet;
	}

	let { locked = $bindable(), voucherFields, className = undefined }: Props = $props();
</script>

<EBox className="{className} grid h-fit sm:grid-cols-2 gap-4">
	{@render voucherFields()}
	{#if locked !== undefined}
		<EButton
			className="ml-auto col-span-full h-fit"
			type="secondary"
			onclick={() => (locked = !locked)}
		>
			{#if locked}
				<Lock />
			{:else}
				<Unlock />
			{/if}
		</EButton>
	{/if}
</EBox>
