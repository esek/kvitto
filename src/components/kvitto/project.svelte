<script lang="ts">
	import { enhance } from '$app/forms';
	import { responseHandler } from '@/helpers/form.helpers';
	import { FormProjectNames } from '@/models/voucher.models';
	import EText from '@components/ui/typography/e-text.svelte';
	import type { Project } from '@prisma/client';
	import { SquareX } from 'lucide-svelte';

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();
</script>

<form
	class="relative grid grid-cols-3 gap-2 rounded border-2 border-brand-black p-1"
	method="post"
	action="?/remove"
	use:enhance={responseHandler}
>
	<input name={FormProjectNames.NUMBER} hidden value={project.number} />
	<EText isBold className="border-r-2 border-brand-black px-2">{project.number}</EText>
	<EText>{project.name}</EText>
	<button>
		<SquareX class="absolute -right-1 -top-1 bg-white fill-brand-danger/80" />
	</button>
</form>
