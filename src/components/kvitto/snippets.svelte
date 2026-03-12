<script lang="ts" module>
	import EText from '@components/ui/typography/e-text.svelte';

	export { max50, emailHelper }
</script>

{#snippet max50()}
    <EText isSecondary>Max 50 tecken!</EText>
{/snippet}
{#snippet emailHelper()}
	<EText isSecondary>Skickar bekräftelse så du når ditt kvitto digitalt</EText>
{/snippet}
