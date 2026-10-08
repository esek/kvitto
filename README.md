# Kvitto 🧾

Kvitto är hemsidan för att lämna in alla former av bokföringsordrar till sektionen. Ta en bild på ditt kvitto,
bifoga din faktura, fyll i din veckorapport, redovisa din sprit, vad som helst!

## Teknik 🔧

- Databasen är en helt vanlig postgresdatabas som beskrivs med hjälp av [Prisma](https://www.prisma.io/)
- Frontend görs med [SvelteKit 5](https://svelte.dev/docs/kit/introduction)
- Fortnox, integration med sektionens bokföringsverktyg.

## Verifikatmodeller / Voucher models

Verifikat finns av typ

- **Voucher (Verifikat/Generell Bokföringsorder)**, grundmodellen för alla bokföringsordrar, i stort sett en kontering och inget mer
- **Expense Claim (Privatutlägg)**, när någon vill få pengar av sektionen på privatköp
- **Expense Report (Sektionskort)**, köp på sektionskort
- **Internal Invoice (Internfaktura)**, för att flytta pengar mellan kostnadsställen
- **Supplier Invoice (Leverantörsfaktura)**, för att lämna in fakturor från leverantörer t.ex. Svensk Cater
- **Drivers Expense (Körersättning)**, säger sig själv
- **Sales Report (Försäljningsredovisning)**, säger sig själv

Samtliga modeller efer **Voucher** beskriver alla former av kompletterande information som kan tänkas behövas till en bokföringsorder.

## Införa nya fomer av verifikat

Skulle det tillkomma ett önskemål om en specfik form av bokföringsorder (ett **specialverifikat**) faller det troligen in som ett specialfall av ovanstående modeller. Antagligen behövs ingen ytterliggare databasmodell.

**LED Veckorapport** är ett exempel på ett specialverifikat som bygger på en försäljningsredovisning.

### Form[Voucher]

Om du vill lägga till ett nytt specialverifikat börjar du med att definiera ett **Form**-verifikat

i [voucher.models.ts](./src/models/voucher.models.ts), som beskriver vad du förväntar dig få tillbaks från ett form i frontended som ska returnera fält nödvändiga för ditt specialverifikat.

### JsonForm[Voucher]

Det typiska sättet att posta från ett form i detta projektet är genom att stringifya hela verifikatet och skicka iväg en hidden input (kika i [voucher-form.svelte](./src/components/kvitto/voucher-form.svelte)). Då kommer det som returneras vara lika med namnet på den gömda inputen som key till strängen. Därför brukar vi skapa en hjälptyp JsonForm som helt enkelt är { inputnamnet : JsonString<FormVoucher> }.

### Form[Voucher]Names

För att garantera att input-fält har unika IDn som också är något rimliga gör vi en lista av key value pairs mellan namnen på alla Form[Voucher] fält och deras fält i strängformat.

### [Voucher]

Till sist definieras the faktiska specialverifikatet genom att, med hjälp as TypeScript, använda samma nycklar som i Form[Voucher] men med de slutgiltiga typerna (eftersom forms bara skickar strängar och nummer i stort sett).

### Övriga voucher models

Du lär inte behöva göra tillägg i de övriga typerna men läs gärna på mera i [voucher.models.ts](./src/models/voucher.models.ts)

# Kontering

Den stora vitsen med kvittohemsidan är att automatiskt generera konteringen tillhörande varje verifikat baserat på typen av verifikat. Den huvudsakliga funktionen som gör detta är [generateAccountingForVoucher](./src/helpers/voucher.helpers.ts). Här finns utvecklingspotential antagligen men den e pretty fucking good.

# Fortnox

Du måste ha nödvändiga kakor på Fortnox för att använda scopes du ber om från Fortnox! Detta måste gå att lösa med [service_account](https://www.fortnox.se/developer/authorization/get-authorization-code) (läs på under account_type) på något vis.

## Konton, kostnadsställen, projekt och leverantörer

Vi populerar databasen med den fulla kontoplanen, alla kostnadsställen, projekt och leverantörer som finns på Fortnox. Detta måste göras med paginering in mind. Det finns ett openAPI schema för Fortnox på deras [API-dokumenteringssida](https://apps.fortnox.se/apidocs). Denna schema ljuger konstant, är helt out of date och suger röv. Det finns därför en del fula jävla lösningar i användningen av detta schema.

Pagineringen kan typ bli ett problem. Det är osannolikt men det kan komma en rate limit från Fortnox som inte låter oss hämta för många sidor för fort. Om vi märker att vi inte längre kan synka med Fortnox kan det vara en tanke att sakta ned våra egna requests.

Den andra stora grejen med kvittohemsidan är [bokföring av verifikat](./src/routes/admin/fortnox/vouchers/[id]/+server.ts). Och den funktionen är för tillfället HOT GARBAGE men funkar. Märk här att det finns en [microservice](https://github.com/esek/kvittohake) för att bygga underlaget som länkas till varje verifikat på Fortnox.

## Resultatrapport

`/resultat` visar intäkter, kostnader och resultat per konto, med räkenskapsår,
datum, kostnadsställe och projekt som filter. Behörigheten är `canApprove || isPengU`,
inklusive utskottschefer och den befintliga överlämningsregeln för tidigare
Pengamästare. Alla behöriga får se alla dimensioner.

Sidbesök hämtar endast räkenskapsår och lokala filterval. Verifikat hämtas först när
användaren trycker på **Visa resultat**. `/resultat/data` kontrollerar inloggning,
behörighet och Fortnox-session även för cacheträffar. Framsteg skickas som en NDJSON-ström
och visas som färdighämtade verifikat av totalantalet. Under listningen visas ett
obestämt förlopp tills totalantalet är känt.

Alla listsidor hämtas före detaljerna. Totalantalet kontrolleras mot Fortnox när det
finns i svaret. Saknade detaljer hämtas med högst fem parallella arbetare; anropens
starter begränsas gemensamt för rapporter i samma serverprocess.

Kompletta verifikat sparas i minnet i sju dagar från slutförd hämtning, per Fortnox-session
och räkenskapsår. Filterändringar återanvänder dessa verifikat. Samtidiga hämtningar
för samma nyckel delar arbete och framsteg. Misslyckade hämtningar cachas inte.
Cachen försvinner vid omstart. Hämtningstid och utgångstid visas i rapporten.

Varje midnatt i `Europe/Stockholm` hämtar servern det senaste räkenskapsåret
(senaste startdatum) för varje Fortnox-session. Serverprocessen måste vara igång
och ha en giltig Fortnox-session i minnet; efter omstart behöver anslutningen
upprättas igen. Token förnyas med samma befintliga OAuth-flöde, utan webbläsare.
Knappen **Hämta senaste bokföringen** hämtar om hela det valda räkenskapsåret
och visar en varning om att det kan ta några minuter samt verkliga framsteg.
Både nattjobbet och knappen ersätter cachen först när hela hämtningen lyckats.
Den tidigare cachen kan fortfarande användas under tiden, så länge den inte gått ut.

Befintliga Fortnox-kakor och tokenförnyelse används. Utan giltig anslutning visas
ett meddelande och en uttrycklig inloggningsknapp, ingen automatisk omdirigering.
Lokala konto- och projektnamn återanvänds; historiska koder från verifikaten läggs
till i filtervalen efter hämtning. Projekt-ID matchas exakt som strängar.

Beloppen räknas i heltalsöre. Perioden följer transaktionsdatum. Dimensionerna
filtreras på varje bokföringsrad och kombineras med OCH. Strukna rader, balanskonton
och resultatöverföringskonto 8999 utesluts. Intäkter omfattar 3000–3999 och 8000–8399,
kostnader 4000–7999 och 8400–8998. Rättelser behåller sitt tecken. Obokförda underlag
ingår inte. Resultatkolumnen visar varje kontos bidrag till intäkter minus kostnader.

Fel vid hämtning loggas på servern. Förloppet visas endast i gränssnittet.
