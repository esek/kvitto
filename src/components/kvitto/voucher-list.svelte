<script lang="ts">
	import EBox from '@components/ui/e-box.svelte';
	import EText from '@components/ui/typography/e-text.svelte';
	import VoucherListItem from './voucher-list-item.svelte';

	interface Props {
		header?: string;
		items: {
			id: string;
			label?: string;
			description?: string;
		}[];
		color: string;
	}

	let { header = undefined, items = [], color }: Props = $props();
</script>

<div class="grid auto-rows-min grid-cols-1 gap-2">
	{#if header}
		<EBox padding={false} className="px-2 py-2 place-items-center {color}">
			<EText isBold>{header}</EText>
		</EBox>
	{/if}

	{#each items as item (item)}
		<VoucherListItem
			id={item.id}
			className="flex gap-2 place-items-center border-2 border-brand-black"
		>
			{#if item.label}
				<EText isBold>{item.label}</EText>
				{#if item.description}
					<EText isLarge>|</EText>
				{/if}
			{/if}
			<EText className="text-nowrap overflow-hidden text-ellipsis">{item.description}</EText>
		</VoucherListItem>
	{/each}
</div>
