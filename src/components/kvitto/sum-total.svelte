<script lang="ts">
	import { centsToCrownsString } from '@/helpers/voucher.helpers';
	import EText from '@components/ui/typography/e-text.svelte';

	interface Props {
		wantedTotalInCents?: number;
		disabled?: boolean;
		totalInCents?: number;
		text?: string;
		className?: string;
	}

	let {
		wantedTotalInCents = $bindable(undefined),
		disabled = false,
		totalInCents = $bindable(0),
		text = '',
		className = ''
	}: Props = $props();
	let warnForWanted = $state(wantedTotalInCents !== undefined);
</script>

<div
	class="{className} flex h-fit place-items-end rounded border-2 border-brand-black p-1 {disabled
		? 'bg-brand-black/10'
		: ''} {wantedTotalInCents !== totalInCents && warnForWanted ? 'bg-brand-danger/80' : ''}"
>
	<EText isBold>{text}</EText>
	<EText className="pl-1 ml-auto truncate text-clip">{centsToCrownsString(totalInCents)}</EText>
</div>
