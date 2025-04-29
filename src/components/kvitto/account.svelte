<script lang="ts">
	import { enhance } from '$app/forms';
	import { responseHandler } from '@/helpers/form.helpers';
	import { FormAccountNames } from '@/models/voucher.models';
	import EText from '@components/ui/typography/e-text.svelte';
	import type { Account } from '@prisma/client';
	import { SquareX } from 'lucide-svelte';

	interface Props {
		account: Account;
	}

	let { account }: Props = $props();
</script>

<form
	class="relative grid grid-cols-5 gap-2 rounded border-2 border-brand-black p-1"
	method="post"
	action="?/remove"
	use:enhance={responseHandler}
>
	<input name={FormAccountNames.NUMBER} hidden value={account.number} />
	<EText isBold className="border-r-2 border-brand-black px-2">{account.number}</EText>
	<EText className="col-span-2 border-r-2 border-brand-black px-2">{account.voucherLabel}</EText>
	<EText>{account.accountingLabel}</EText>
	<button>
		<SquareX class="absolute -right-1 -top-1 bg-white fill-brand-danger/80" />
	</button>
</form>
