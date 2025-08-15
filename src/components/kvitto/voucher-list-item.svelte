<script lang="ts">
	import Routes from '@/constants/routes.constants';
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		className?: string;
		children: Snippet<[]>;
	}

	let { id, className = undefined, children }: Props = $props();
</script>

<a
	href={Routes.AdminVouchersId(id)}
	class="h-[48px] rounded px-4 py-[12px] text-white transition duration-150 ease-in-out hover:translate-x-0.5 hover:shadow-lg {className}"
>
	{@render children()}
</a>
