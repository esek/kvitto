<script lang="ts">
	import { getAccountFavourites } from '@/context/account-favourites.svelte';
	import AccountFavouriteButton from '@components/kvitto/account-favourite-button.svelte';
	const favourites = getAccountFavourites();
	let showOtherAccounts = $state(false);
	let viewMode = $state<'account' | 'project'>('account');
	let expandedRows = new SvelteSet<string>();

	import { projectMatchesProfitCenter } from '@/helpers/voucher.helpers';
	import { SvelteSet, SvelteURLSearchParams } from 'svelte/reactivity';
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import type { ReportEvent, ReportProgress, ReportResult } from '@/models/resultat.models';
	import EHeading from '@components/ui/typography/e-heading.svelte';
	import EText from '@components/ui/typography/e-text.svelte';
	import EButton from '@components/ui/e-button.svelte';
	import { TW_BORDER_STYLE } from '@/constants/borderstyle.constants';
	import { formatDate, formatTime } from '@/helpers/date.helpers';
	import Routes from '@/constants/routes.constants';

	let { data }: { data: PageData } = $props();
	let yearId = $state('');
	let from = $state('');
	let to = $state('');
	let costCenter = $state('');
	let project = $state('');
	let loading = $state(false);
	let needsSetup = $state(false);
	let failure = $state('');
	let result = $state<ReportResult | null>(null);
	let progress = $state<ReportProgress | null>(null);
	let controller: AbortController | undefined;
	const favouriteRows = $derived(
		result?.report.rows.filter((row) => favourites.numbers.includes(row.account)) ?? []
	);
	const otherRows = $derived(
		result?.report.rows.filter((row) => !favourites.numbers.includes(row.account)) ?? []
	);
	const otherIncome = $derived(
		otherRows.filter((row) => row.income).reduce((sum, row) => sum + row.period, 0)
	);
	const otherCosts = $derived(
		otherRows.filter((row) => !row.income).reduce((sum, row) => sum + row.period, 0)
	);
	const money = (cents: number) =>
		new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(cents / 100);
	let selectedYear = $derived(
		data.fortnoxSetupRequired ? undefined : data.years.find((y) => String(y.Id) === yearId)
	);
	let projects = $derived(result?.projects ?? (data.fortnoxSetupRequired ? [] : data.projects));
	let costCenters = $derived(
		result?.costCenters ?? (data.fortnoxSetupRequired ? [] : data.costCenters)
	);

	$effect(() => {
		controller?.abort();
		needsSetup = data.fortnoxSetupRequired;
		result = null;
		progress = null;
		failure = '';
		if (!data.fortnoxSetupRequired) {
			yearId = String(data.year.Id);
			from = data.filters.from;
			to = data.filters.to;
			costCenter = data.filters.costCenter;
			project = data.filters.project;
		}
	});
	onDestroy(() => controller?.abort());
	function changeYear(event: Event) {
		yearId = (event.currentTarget as HTMLSelectElement).value;
		const year = data.fortnoxSetupRequired
			? undefined
			: data.years.find((item) => String(item.Id) === yearId);
		if (!year) return;
		from = year.FromDate;
		const today = formatDate();
		to = today >= from && today <= year.ToDate ? today : year.ToDate;
	}

	const filteredProjects = $derived(
		projects.filter((option) => projectMatchesProfitCenter(option.label, costCenter))
	);
	$effect(() => {
		if (
			project &&
			project !== '__none__' &&
			!filteredProjects.some((option) => option.value === project)
		)
			project = '';
	});

	async function showReport(event: SubmitEvent) {
		event.preventDefault();
		if (loading) return;
		loading = true;
		failure = '';
		progress = null;
		// Keep the last filter options (including historical codes) but hide stale totals while loading.
		controller = new AbortController();
		let receivedResult = false;
		const handle = (message: ReportEvent) => {
			if (message.type === 'progress') progress = message.progress;
			else if (message.type === 'result') {
				result = message.result;
				showOtherAccounts = false;
				expandedRows.clear();
				receivedResult = true;
			} else if (message.type === 'setup') needsSetup = true;
			else if (message.type === 'error') throw new Error(message.message);
		};
		try {
			const query = new SvelteURLSearchParams({ year: yearId, from, to, costCenter, project });
			if (event.submitter instanceof HTMLButtonElement && event.submitter.value === 'refresh')
				query.set('refresh', '1');
			const response = await fetch(`${Routes.Resultat}/data?${query}`, {
				method: 'POST',
				signal: controller.signal
			});
			if (!response.ok) {
				const body = await response.json().catch(() => null);
				throw new Error(body?.message || 'Kunde inte hämta resultat. Försök igen.');
			}
			if (response.headers.get('content-type')?.includes('application/json')) {
				handle(await response.json());
			} else {
				if (!response.body) throw new Error('Tomt svar från servern.');
				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let buffer = '';
				try {
					while (true) {
						const { value, done } = await reader.read();
						buffer += decoder.decode(value, { stream: !done });
						let newline: number;
						while ((newline = buffer.indexOf('\n')) !== -1) {
							const line = buffer.slice(0, newline);
							buffer = buffer.slice(newline + 1);
							if (line.trim()) handle(JSON.parse(line));
						}
						if (done) {
							if (buffer.trim()) handle(JSON.parse(buffer));
							break;
						}
					}
				} finally {
					reader.releaseLock();
				}
			}
			if (!receivedResult && !needsSetup)
				throw new Error('Hämtningen avbröts innan rapporten var klar. Försök igen.');
		} catch (cause) {
			controller.abort();
			if (!(cause instanceof DOMException && cause.name === 'AbortError')) {
				failure = cause instanceof Error ? cause.message : 'Kunde inte hämta resultat.';
			}
		} finally {
			loading = false;
		}
	}
</script>

{#snippet voucherDetails(vouchers: ReportResult['report']['rows'][number]['vouchers'], id: string)}
	{#if vouchers.length}
		<tr id={id} class="border-b bg-gray-50 dark:bg-gray-900">
			<td colspan="5" class="p-3">
				<table class="w-full text-sm">
					<thead
						><tr class="border-b text-left"
							><th scope="col" class="p-1 font-medium">Verifikat</th><th scope="col" class="p-1 font-medium">Datum</th><th scope="col" class="p-1 font-medium">Beskrivning</th><th scope="col" class="p-1 text-right font-medium">Belopp</th></tr
						></thead
					>
					<tbody>
						{#each vouchers as voucher, i (`${voucher.series}-${voucher.number}-${voucher.rowIndex}-${i}`)}
							<tr class="border-b last:border-0"
								><td class="whitespace-nowrap p-1">{#if voucher.voucherId}
									<a href={Routes.AdminVouchersId(voucher.voucherId)} class="underline hover:no-underline">{voucher.series}{voucher.number}</a>
								{:else}
									{voucher.series}{voucher.number}
								{/if}
								</td><td
									class="whitespace-nowrap p-1">{voucher.date}</td
								><td class="p-1">{voucher.description}</td><td
									class="whitespace-nowrap p-1 text-right tabular-nums">{money(voucher.amount)}</td
								></tr
							>
						{/each}
					</tbody>
				</table>
			</td>
		</tr>
	{/if}
{/snippet}

{#snippet accountRow(row: ReportResult['report']['rows'][number])}
	{@const rowId = `account-${row.account}`}
	{@const isExpanded = expandedRows.has(rowId)}
	<tr class="border-b"
		><th scope="row" class="p-2 font-normal"
			><span class="inline-flex items-center"
				><button
					type="button"
					class="mr-1 rounded p-1 underline"
					aria-expanded={isExpanded}
					aria-controls={rowId}
					onclick={() => {
						if (isExpanded) expandedRows.delete(rowId);
						else expandedRows.add(rowId);
					}}
					>{row.account}</button
				><AccountFavouriteButton account={row.account} /></span
			></th
		><td class="p-2">{row.label}</td><td class="whitespace-nowrap p-2 text-right tabular-nums"
			>{money(row.income ? row.period : 0)}</td
		><td class="whitespace-nowrap p-2 text-right tabular-nums"
			>{money(row.income ? 0 : row.period)}</td
		><td class="whitespace-nowrap p-2 text-right tabular-nums"
			>{money(row.income ? row.period : -row.period)}</td
		></tr
	>
	{#if isExpanded}
		{@render voucherDetails(row.vouchers, rowId)}
	{/if}
{/snippet}

{#snippet projectRow(row: ReportResult['report']['projectRows'][number])}
	{@const rowId = `project-${row.project || 'none'}`}
	{@const isExpanded = expandedRows.has(rowId)}
	<tr class="border-b"
		><th scope="row" class="p-2 font-normal"
			><button
				type="button"
				class="rounded p-1 underline"
				aria-expanded={isExpanded}
				aria-controls={rowId}
				onclick={() => {
					if (isExpanded) expandedRows.delete(rowId);
					else expandedRows.add(rowId);
				}}
				>{row.project || '—'}</button
			></th
		><td class="p-2">{row.label}</td><td class="whitespace-nowrap p-2 text-right tabular-nums"
			>{money(row.income)}</td
		><td class="whitespace-nowrap p-2 text-right tabular-nums">{money(row.costs)}</td
		><td class="whitespace-nowrap p-2 text-right tabular-nums">{money(row.result)}</td
		></tr
	>
	{#if isExpanded}
		{@render voucherDetails(row.vouchers, rowId)}
	{/if}
{/snippet}

<svelte:head><title>Resultat | Kvitto</title></svelte:head>
<EHeading>Resultat</EHeading>
{#if data.fortnoxSetupRequired || needsSetup}
	<EText
		>Fortnox är inte anslutet, eller så saknar anslutningen läsbehörighet. Någon med läsbehörighet
		för bokföringen i Fortnox behöver ansluta resultatsidan en gång för alla behöriga användare.
		Anslutningen delas mellan enheter tills servern startas om.</EText
	>
	<EButton href={data.fortnoxLoginUrl}>Anslut Fortnox för resultat</EButton>
{:else}
	<EText>Välj period och klicka på Visa resultat. Endast bokförda underlag i Fortnox ingår.</EText>
	<form onsubmit={showReport} class="grid gap-3 md:grid-cols-2">
		<fieldset disabled={loading} class="contents">
			<label class="grid gap-1" for="report-year"
				>Räkenskapsår
				<select
					id="report-year"
					bind:value={yearId}
					onchange={changeYear}
					class="form-control rounded border p-2 {TW_BORDER_STYLE}"
				>
					{#each data.years as year (year.Id)}<option value={String(year.Id)}
							>{year.FromDate} – {year.ToDate}</option
						>{/each}
				</select>
			</label>
			<div class="hidden md:block"></div>
			<label class="grid gap-1" for="report-from"
				>Från
				<input
					id="report-from"
					type="date"
					required
					min={selectedYear?.FromDate}
					max={selectedYear?.ToDate}
					bind:value={from}
					class="form-control rounded border p-2 {TW_BORDER_STYLE}"
				/>
			</label>
			<label class="grid gap-1" for="report-to"
				>Till
				<input
					id="report-to"
					type="date"
					required
					min={from || selectedYear?.FromDate}
					max={selectedYear?.ToDate}
					bind:value={to}
					class="form-control rounded border p-2 {TW_BORDER_STYLE}"
				/>
			</label>
			<label class="grid gap-1" for="report-cost-center"
				>Kostnadsställe
				<select
					id="report-cost-center"
					bind:value={costCenter}
					class="form-control rounded border p-2 {TW_BORDER_STYLE}"
				>
					<option value="">Alla kostnadsställen</option><option value="__none__"
						>Utan kostnadsställe</option
					>
					{#each costCenters as code (code)}<option value={code}>{code}</option>{/each}
				</select>
			</label>
			<label class="grid gap-1" for="report-project"
				>Projekt
				<select
					id="report-project"
					bind:value={project}
					class="form-control rounded border p-2 {TW_BORDER_STYLE}"
				>
					<option value="">Alla projekt</option><option value="__none__">Utan projekt</option>
					{#each filteredProjects as option (option.value)}<option value={option.value}
							>{option.label !== option.value
								? `${option.label} (${option.value})`
								: option.value}</option
						>{/each}
				</select>
			</label>
			<EButton isSubmit disabled={loading} isLoading={loading} className="self-start"
			>Visa resultat</EButton
		>
			<div class="grid gap-1">
				<EButton isSubmit name="action" value="refresh" type="secondary" disabled={loading}>
					Hämta senaste bokföringen
				</EButton>
				<EText isSmall
					>Hämtar om hela det valda räkenskapsåret från Fortnox. Det kan ta några minuter.</EText
				>
			</div>
		</fieldset>
	</form>
	<noscript>JavaScript behövs för att hämta rapporten och visa förloppet.</noscript>
	{#if loading}
		<div role="status" class="grid gap-2">
			{#if progress?.phase === 'listing' || !progress}
				<p>
					Hämtar verifikatlistan… {progress
						? `${progress.listed}${progress.total !== null ? ` av ${progress.total}` : ''} hittade.`
						: ''}
				</p>
				<progress aria-label="Hämtar verifikatlistan" class="w-full"></progress>
			{:else}
				<p>
					{progress.fetched} av {progress.total} verifikat hämtade.{progress.phase === 'complete'
						? ' Beräknar rapporten…'
						: ''}
				</p>
				<progress
					aria-label="Hämtade verifikat"
					max={progress.total || 1}
					value={progress.total === 0 ? 1 : progress.fetched}
					class="w-full"
				></progress>
			{/if}
		</div>
	{/if}
	{#if failure}<p role="alert" class="text-red-700">{failure}</p>{/if}
	{#if result && !loading && !failure}
		<section aria-label="Resultatrapport">
			<p class="mb-3">
				Period: {result.filters.from} – {result.filters.to}. Kostnadsställe: {result.filters
					.costCenter === '__none__'
					? 'Utan'
					: result.filters.costCenter || 'Alla'}. Projekt: {result.filters.project === '__none__'
					? 'Utan'
					: result.filters.project || 'Alla'}.
			</p>
			<div class="mb-4 grid gap-3 md:grid-cols-3">
				{#each [{ label: 'Intäkter', value: result.report.income }, { label: 'Kostnader', value: result.report.costs }, { label: 'Resultat', value: result.report.result }] as total (total.label)}
					<div class="rounded border p-3 {TW_BORDER_STYLE}">
						<div>{total.label}</div>
						<strong class="text-xl tabular-nums">{money(total.value)}</strong>
					</div>
				{/each}
			</div>
			<div class="mb-3 inline-flex" role="group" aria-label="Visa resultat per">
				<EButton
					type={viewMode === 'account' ? 'primary' : 'secondary'}
					className="view-toggle"
					onclick={() => (viewMode = 'account')}>Per konto</EButton
				>
				<EButton
					type={viewMode === 'project' ? 'primary' : 'secondary'}
					className="view-toggle -ml-px"
					onclick={() => (viewMode = 'project')}>Per projekt</EButton
				>
			</div>
			{#if viewMode === 'account'}
				<p class="mb-3 text-sm">
					Stjärnmarkera konton här eller i kontolistan för att spara dina personliga favoriter.
					Favoriter visas var för sig. Övriga konton summeras under Andra konton; klicka för att visa
					alla detaljer och välja fler favoriter. Summorna omfattar alltid samtliga konton i urvalet.
					Dina favoriter föreslås också när du fokuserar ett tomt kontofält i konteringen.
				</p>
			{/if}
			<div class="overflow-x-auto">
				{#if viewMode === 'account'}
					<table class="w-full text-left">
						<caption class="sr-only"
							>Intäkter, kostnader och resultat per konto för vald period</caption
						>
						<thead
							><tr class="border-b"
								><th scope="col" class="p-2">Konto</th><th scope="col" class="p-2">Kontonamn</th><th
									scope="col"
									class="p-2 text-right">Intäkter</th
								><th scope="col" class="p-2 text-right">Kostnader</th><th
									scope="col"
									class="p-2 text-right">Resultat</th
								></tr
							></thead
						>
						<tbody>
							{#each favouriteRows as row (row.account)}
								{@render accountRow(row)}
							{/each}
							{#if otherRows.length}
								<tr class="border-b font-semibold">
									<th colspan="2" scope="row" class="p-2">
										<button
											type="button"
											class="rounded p-1 underline"
											aria-expanded={showOtherAccounts}
											aria-controls="other-accounts"
											onclick={() => (showOtherAccounts = !showOtherAccounts)}
										>
											Andra konton ({otherRows.length}) — {showOtherAccounts
												? 'Dölj detaljer'
												: 'Visa detaljer'}
										</button>
									</th>
									<td class="whitespace-nowrap p-2 text-right tabular-nums">{money(otherIncome)}</td>
									<td class="whitespace-nowrap p-2 text-right tabular-nums">{money(otherCosts)}</td>
									<td class="whitespace-nowrap p-2 text-right tabular-nums"
										>{money(otherIncome - otherCosts)}</td
									>
								</tr>
							{/if}
							{#if result.report.rows.length === 0}<tr
									><td colspan="5" class="p-2">Ingen bokföring på resultatkonton för detta urval.</td
									></tr
								>{/if}
						</tbody>
						<tbody id="other-accounts" hidden={!showOtherAccounts}>
							{#each otherRows as row (row.account)}
								{@render accountRow(row)}
							{/each}
						</tbody>
						<tfoot
							><tr class="font-bold"
								><th colspan="2" scope="row" class="p-2">Summa</th><td
									class="whitespace-nowrap p-2 text-right">{money(result.report.income)}</td
								><td class="whitespace-nowrap p-2 text-right">{money(result.report.costs)}</td><td
									class="whitespace-nowrap p-2 text-right">{money(result.report.result)}</td
								></tr
							></tfoot
						>
					</table>
				{:else}
					<table class="w-full text-left">
						<caption class="sr-only"
							>Intäkter, kostnader och resultat per projekt för vald period</caption
						>
						<thead
							><tr class="border-b"
								><th scope="col" class="p-2">Projekt</th><th scope="col" class="p-2">Projektnamn</th><th
									scope="col"
									class="p-2 text-right">Intäkter</th
								><th scope="col" class="p-2 text-right">Kostnader</th><th
									scope="col"
									class="p-2 text-right">Resultat</th
								></tr
							></thead
						>
						<tbody>
							{#each result.report.projectRows as row (row.project)}
								{@render projectRow(row)}
							{/each}
							{#if result.report.projectRows.length === 0}<tr
									><td colspan="5" class="p-2">Ingen bokföring på resultatkonton för detta urval.</td
									></tr
								>{/if}
						</tbody>
						<tfoot
							><tr class="font-bold"
								><th colspan="2" scope="row" class="p-2">Summa</th><td
									class="whitespace-nowrap p-2 text-right">{money(result.report.income)}</td
								><td class="whitespace-nowrap p-2 text-right">{money(result.report.costs)}</td><td
									class="whitespace-nowrap p-2 text-right">{money(result.report.result)}</td
								></tr
							></tfoot
						>
					</table>
				{/if}
			</div>
		</section>
		<EText isSmall
			>Bokföring hämtad {formatDate(result.fetchedAt)} kl. {formatTime(result.fetchedAt)} UTC. Sparas
			till {formatDate(result.expiresAt)} kl. {formatTime(result.expiresAt)} UTC. Nya bokningar efter
			hämtningen ingår inte förrän uppgifterna hämtas igen.</EText
		>
	{/if}
	<EText isSmall
		>Belopp i SEK. Intäkter minus kostnader ger resultatet. Rättelser kan ge negativa belopp. Hämtad
		bokföring återanvänds i upp till en vecka. Det senaste räkenskapsåret uppdateras varje natt vid
		midnatt (svensk tid). Använd Hämta senaste bokföringen för att uppdatera direkt.</EText
	>
	<EText isSmall
		>Resultatkonton 3000–8998 ingår. Konto 8999 (årets resultat) ingår inte. Konton 8000–8399 visas
		bland intäkter och 8400–8998 bland kostnader.</EText
	>
{/if}

<style>
	:global([aria-label='Visa resultat per'] .view-toggle:first-child) {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	:global([aria-label='Visa resultat per'] .view-toggle:last-child) {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
	:global(.e-button.view-toggle),
	:global(button.e-button.view-toggle),
	:global(a.e-button.view-toggle) {
		transition: none;
	}
	:global(.e-button.view-toggle:hover:enabled),
	:global(button.e-button.view-toggle:hover:enabled),
	:global(a.e-button.view-toggle:hover:enabled) {
		scale: none;
		transform: none;
	}
	:global(.e-button.view-toggle:active:enabled),
	:global(button.e-button.view-toggle:active:enabled),
	:global(a.e-button.view-toggle:active:enabled) {
		transform: none;
	}
</style>
