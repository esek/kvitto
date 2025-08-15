<script lang="ts">
	import { enhance } from '$app/forms';
	import { responseHandler } from '@/helpers/form.helpers';
	import EButton from '@components/ui/e-button.svelte';
</script>

<form method="POST" use:enhance={responseHandler}>
	<EButton isSubmit formaction="?/sync">Synka med fortnox</EButton>
</form>
