<script lang="ts">
	import EBox from '@components/ui/e-box.svelte';
	import EText from '@components/ui/typography/e-text.svelte';
	import VoucherListItem from './voucher-list-item.svelte';
	import { TW_BORDER_STYLE } from '@/constants/borderstyle.constants';

	interface Props {
		header?: string;
		items: {
			id: string;
			label?: string;
			description?: string;
			transactionDate?: Date | null;
			ident: {
				number: number;
				series: string;
			} | null;
			color: string;
		}[];
		color: string;
		colorItems?: boolean;
		initiallyOpen?: boolean;
	}

	const now = new Date()

	let { header = undefined, items = [], color, colorItems = false, initiallyOpen = true }: Props = $props();

	let open = $state(initiallyOpen)
</script>

<div class="grid auto-rows-min grid-cols-1 gap-2">
	{#if header}
		<EBox padding={false} className="px-2 h-[48px] py-[12px] place-items-center {color} cursor-pointer" onclick={() => open = !open}>
			<EText isBold>{open ? "↓" : "→"} {header}</EText>
		</EBox>
	{/if}

	{#if open}
		{#each items as item (item)}
			<VoucherListItem
				id={item.id}
				className="flex gap-2 place-items-center {TW_BORDER_STYLE} {colorItems ? item.color : ''}"
			>
				{#if item.label}
					<EText isBold>{item.label}</EText>
					{#if item.description}
						<EText isLarge>|</EText>
					{/if}
				{/if}
				<EText className="text-nowrap overflow-hidden text-ellipsis">{item.description}</EText>
				{#if item.transactionDate}
					{@const itemYear = item.transactionDate.getFullYear() }
					<EText isBold className="ml-auto">{itemYear === now.getFullYear() ? "" : itemYear} {item.ident?.series}{item.ident?.number}</EText>
				{/if}
			</VoucherListItem>
		{/each}
	{/if}
</div>
