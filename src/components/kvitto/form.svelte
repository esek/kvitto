<script lang="ts">
	import { enhance } from '$app/forms';
	import { formErrors, formLoad } from '@/context/form.store';
	import { responseHandler, fakeTab, preventEnterSubmission } from '@/helpers/form.helpers';
	import EBox from '@components/ui/e-box.svelte';
	import EButton from '@components/ui/e-button.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		errors?: Record<string, string>;
		formFields: Snippet;
		action?: string;
	}

	let { errors = $bindable({}), action, formFields }: Props = $props();
	formErrors.set({});
	formErrors.subscribe((e) => (errors = e));
</script>

<EBox>
	<form
		class="grid gap-4 sm:grid-cols-2"
		use:enhance={responseHandler}
		use:preventEnterSubmission={() => fakeTab(document)}
		method="POST"
		enctype="multipart/form-data"
		{action}
		onsubmit={() => formLoad.set(true)}
	>
		{@render formFields()}
		<EButton disabled={$formLoad} className="ml-auto col-span-full" isSubmit>Skicka</EButton>
	</form>
</EBox>
