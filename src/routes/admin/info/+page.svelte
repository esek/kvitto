<script lang="ts">
	import {
		CAN_APPROVE_IDS,
		PENGU_CHIEFS_POST_IDS,
		PENGU_POST_IDS,
		POST_ID_TO_NAME
	} from '@/constants/user.constants';
	import EHeading from '@components/ui/typography/e-heading.svelte';
	import EText from '@components/ui/typography/e-text.svelte';
</script>

<EHeading>Information</EHeading>

<div>
	<EText isSmall>För internfakturor så kan man bara välja tillgångs- och kostnadskonton.</EText>
	<EText isSmall>Projekt som börjar på t.ex. INFU kan bara väljas då kostnadsstället är INFU01.</EText>
	<EText isSmall>Som undantagsfall för nybörjare kan man inte välja kostnadsställe eller projekt om kontot är 1920.</EText>
</div>

<EHeading>Behörigheter</EHeading>

<div>
	<EText isBold>Att godkänna och byta utskott på verifikat</EText>
	{#each CAN_APPROVE_IDS as id (id)}
		<EText isSmall>{POST_ID_TO_NAME[id]}</EText>
	{/each}
</div>
<div>
	<EText isBold>Hantera betalningsrelaterade uppgifter</EText>
	{#each PENGU_CHIEFS_POST_IDS as id (id)}
		<EText isSmall>{POST_ID_TO_NAME[id]}</EText>
	{/each}
</div>
<div>
	<EText isBold>Redigera etiketter, serier, transaktionsdatum, avböja verifikat och bokföra</EText>
	{#each PENGU_POST_IDS as id (id)}
		<EText isSmall>{POST_ID_TO_NAME[id]}</EText>
	{/each}
</div>
