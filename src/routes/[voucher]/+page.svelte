<script lang="ts">
	import Voucher from '@components/kvitto/voucher.svelte';
	import type { PageData } from './$types';
	import { defaultPrivateVoucher, defaultVoucher } from '@/constants/voucher.constants';
	import EBox from '@components/ui/e-box.svelte';
	import { autofillUserInfo } from '@/helpers/voucher.helpers';
	import { enhance } from '$app/forms';
	import EButton from '@components/ui/e-button.svelte';
	import { responseHandler } from '@/helpers/form.helpers';

	let { data }: { data: PageData } = $props();
	let voucher = $state(autofillUserInfo(data.user, defaultVoucher()));
	if (data.isPrivate) {
		voucher.privateVoucher = defaultPrivateVoucher();
	}
</script>

<form class="md:w-1/3" use:enhance={responseHandler} method="POST" enctype="multipart/form-data">
	<EBox className="w-fit grid gap-2">
		<Voucher bind:voucher receiptUpload accounts={data.accounts} />
		<EButton className="ml-auto" isSubmit>Skicka</EButton>
	</EBox>
</form>
