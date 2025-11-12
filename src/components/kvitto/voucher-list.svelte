<script lang="ts">
	import EBox from '@components/ui/e-box.svelte';
	import EText from '@components/ui/typography/e-text.svelte';
	import VoucherListItem from './voucher-list-item.svelte';
	import { TW_BORDER_STYLE } from '@/constants/borderstyle.constants';
	import { getWeekNumberByDate } from '@/helpers/date.helpers';

	interface Props {
		header?: string;
		items: {
			id: string;
			label?: string;
			description?: string;
			transactionDate?: Date | null;
		}[];
		color: string;
	}

	let { header = undefined, items = [], color }: Props = $props();
</script>

<div class="grid auto-rows-min grid-cols-1 gap-2">
	{#if header}
		<EBox padding={false} className="px-2 h-[48px] py-[12px] place-items-center {color}">
			<EText isBold>{header}</EText>
		</EBox>
	{/if}

	{#each items as item (item)}
		<VoucherListItem id={item.id} className="flex gap-2 place-items-center {TW_BORDER_STYLE}">
			{#if item.label}
				<EText isBold>{item.label}</EText>
				{#if item.description}
					<EText isLarge>|</EText>
				{/if}
			{/if}
			<EText className="text-nowrap overflow-hidden text-ellipsis">{item.description}</EText>
			{#if item.transactionDate}
				<EText isBold className="ml-auto">v.{getWeekNumberByDate(item.transactionDate)}</EText>
			{/if}
		</VoucherListItem>
	{/each}
</div>
