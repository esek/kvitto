<script lang="ts">
	import { enhance } from '$app/forms';
	import { formLoad } from '@/context/form.store';
	import { responseHandler } from '@/helpers/form.helpers';
	import { FormProfitCenterNames, type NewProfitCenter } from '@/models/voucher.models';
	import EText from '@components/ui/typography/e-text.svelte';
	import type { ProfitCenter } from '@prisma/client';
	import { SquareX } from 'lucide-svelte';

	interface Props {
		profitCenter: ProfitCenter;
	}

	let { profitCenter }: Props = $props();
</script>

<form
	class="relative grid grid-cols-3 gap-2 rounded border-2 border-brand-black p-1"
	method="post"
	action="?/remove"
	onsubmit={() => formLoad.set(true)}
	use:enhance={responseHandler}
>
	<input name={FormProfitCenterNames.NAME} hidden value={profitCenter.name} />
	<EText isBold className="border-r-2 border-brand-black px-2">{profitCenter.name}</EText>
	<EText>{profitCenter.utskott}</EText>
	<button disabled={$formLoad}>
		<SquareX class="absolute -right-1 -top-1 bg-white fill-brand-danger/80" />
	</button>
</form>
