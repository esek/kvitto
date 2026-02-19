<script lang="ts">
	import {
		CAN_APPROVE_IDS,
		PENGAMASTARE_POST_ID,
		PENGU_CHIEFS_POST_IDS,
		PENGU_POST_IDS,
		POST_ID_TO_NAME
	} from '@/constants/user.constants';
	import EHeading from '@components/ui/typography/e-heading.svelte';
	import EText from '@components/ui/typography/e-text.svelte';
</script>

<EHeading>Information</EHeading>

<div>
	<EText>För internfakturor så kan man bara välja tillgångs- och kostnadskonton.</EText>
	<EText>Projekt som börjar på t.ex. INFU kan bara väljas då kostnadsstället är INFU01.</EText>
	<EText>Som undantagsfall för nybörjare kan man inte välja kostnadsställe eller projekt om kontot är 1920.</EText>
</div>

<EHeading>Behörigheter</EHeading>

<div>
	<EText isBold>Att godkänna och byta utskott på verifikat</EText>
	{#each CAN_APPROVE_IDS as id (id)}
		<EText isSmall>{POST_ID_TO_NAME[id]}</EText>
	{/each}
	<EText isSmall>Tidigare {POST_ID_TO_NAME[PENGAMASTARE_POST_ID]} i januari & februari (om man hade posten den 20de december året innan)</EText>
</div>
<div>
	<EText isBold>Hantera betalningsrelaterade uppgifter</EText>
	{#each PENGU_CHIEFS_POST_IDS as id (id)}
		<EText isSmall>{POST_ID_TO_NAME[id]}</EText>
	{/each}
	<EText isSmall>Tidigare {POST_ID_TO_NAME[PENGAMASTARE_POST_ID]} i januari & februari (om man hade posten den 20de december året innan)</EText>
</div>
<div>
	<EText isBold>Redigera etiketter, serier, transaktionsdatum, avböja verifikat och bokföra</EText>
	{#each PENGU_POST_IDS as id (id)}
		<EText isSmall>{POST_ID_TO_NAME[id]}</EText>
	{/each}
	<EText isSmall>Tidigare {POST_ID_TO_NAME[PENGAMASTARE_POST_ID]} i januari & februari (om man hade posten den 20de december året innan)</EText>
</div>
