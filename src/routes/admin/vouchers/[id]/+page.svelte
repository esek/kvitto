<script lang="ts">
	import type { PageData } from './$types';
	import EButton from '@components/ui/e-button.svelte';
	import { enhance } from '$app/forms';
	import AccountingTable from '@components/kvitto/accounting-table.svelte';
	import {
		FormDriversExpenseNames,
		FormExpenseClaimNames,
		FormVoucherNames
	} from '@/models/voucher.models';
	import { responseHandler } from '@/helpers/form.helpers';
	import EDatePicker from '@components/ui/e-date-picker.svelte';
	import EInput from '@components/ui/e-input.svelte';
	import { SERIES_OPTIONS } from '@/constants/voucher.constants';
	import VoucherEditAndPreview from '@components/kvitto/voucher-edit-and-preview.svelte';
	import ExpenseClaim from '@components/kvitto/expense-claim.svelte';
	import {
		generateAccountingForVoucher,
		getAccountOptionsForVouchers
	} from '@/helpers/voucher.helpers';
	import ExpenseReport from '@components/kvitto/expense-report.svelte';
	import InternalInvoice from '@components/kvitto/internal-invoice.svelte';
	import SupplierInvoice from '@components/kvitto/supplier-invoice.svelte';
	import DriversExpense from '@components/kvitto/drivers-expense.svelte';
	import { formErrors, formLoad } from '@/context/form.store';
	import EBox from '@components/ui/e-box.svelte';
	import { UTSKOTT_OPTIONS } from '@/constants/utskott.contstants';
	import SalesReport from '@components/kvitto/sales-report.svelte';
	import { notifications } from '@/context/notifications.store';
	import EText from '@components/ui/typography/e-text.svelte';
	import { ExternalLink } from 'lucide-svelte';
	import { isWareAccount } from '$lib/account';
	import Routes from '@/constants/routes.constants';
	import ETextarea from '@components/ui/e-textarea.svelte';
	import { max50 } from '@components/kvitto/snippets.svelte';

	let { data }: { data: PageData } = $props();
	let voucher = $state(structuredClone(data.voucher));

	$effect(() => {
		voucher = structuredClone(data.voucher);
	});

	// Create reactive JSON that always reflects current voucher state
	let voucherJson = $derived(JSON.stringify(voucher));

	let wantedTotalInCents = $state(0);
	let errors: Record<string, string> = $state({});
	formErrors.set({});
	formErrors.subscribe((e) => (errors = e));

	const generateAccounting = () => {
		const generatedAccounting = generateAccountingForVoucher(
			voucher,
			data.profitCenters,
			data.accounts,
			data.projects
		);
		voucher.accounting = voucher.accounting.concat(generatedAccounting);
	};

	const downloadVoucher = async () => {
		const resp = await fetch(Routes.FortnoxVouchersId(voucher.id), { method: 'GET' });
		if (resp.status !== 200) {
			notifications.add('danger', 'Kunde inte ladda ner!', await resp.text());
			return;
		}
		const blob = await resp.blob();
		const objUrl = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = objUrl;
		link.download = 'voucher.pdf';
		link.click();
		setTimeout(() => {
			window.URL.revokeObjectURL(objUrl);
		}, 250);
	};

	let deleteForSure = $state(false);

	let accounts = $derived(
		voucher.internalInvoice
			? data.accounts.filter((opt) => isWareAccount(opt.number))
			: data.accounts
	);

	const preventEnterSubmission = (node: HTMLFormElement) => {
		function handleKeydown(event: KeyboardEvent) {
			if (event.key === 'Enter') {
				event.preventDefault();
			}
		}

		node.addEventListener('keydown', handleKeydown);

		return {
			destroy() {
				node.removeEventListener('keydown', handleKeydown);
			}
		};
	};
</script>

<form
	class="grid gap-2"
	use:enhance={responseHandler}
	use:preventEnterSubmission
	onsubmit={() => {
		formLoad.set(true);
	}}
	method="POST"
	enctype="multipart/form-data"
>
	<input type="hidden" name="user" value={JSON.stringify(data.user)} />
	<input hidden name="voucher" value={voucherJson} />
	<input hidden name="ispengu" value={data.user.isPengU} />
	<EBox className="grid auto-rows-min gap-4">
		{#if !voucher.supplierInvoice}
			<AccountingTable
				bind:accounting={voucher.accounting}
				bind:wantedTotalInCents
				bind:errors
				id={FormVoucherNames.ACCOUNTING}
				{accounts}
				profitCenters={data.profitCenters}
				projects={data.projects}
				generate={generateAccounting}
				disabled={voucher.accounted}
			/>
		{:else}
			<AccountingTable
				bind:accounting={voucher.accounting}
				bind:errors
				id={FormVoucherNames.ACCOUNTING}
				{accounts}
				profitCenters={data.profitCenters}
				projects={data.projects}
				generate={generateAccounting}
				disabled={voucher.accounted}
			/>
		{/if}
	</EBox>
	<div class="grid {voucher.attachmentUrl ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-2">
		{#if voucher.attachmentUrl}
			{#if voucher.attachmentUrl.endsWith('.pdf')}
				<EBox className="grid h-fit w-full place-items-center">
					<EButton target="_blank" href={voucher.attachmentUrl}>Visa bilaga</EButton>
				</EBox>
			{:else}
				<EBox padding={false} className="p-2 md:col-span-1 relative">
					<a
						target="_blank"
						href={voucher.attachmentUrl}
						class="absolute right-0 top-0 rounded bg-white p-1"
					>
						<ExternalLink />
					</a>
					<img src={voucher.attachmentUrl} alt="/favicon.png" />
				</EBox>
			{/if}
		{/if}
		<div class="grid auto-rows-min gap-2 md:col-span-2">
			{#if voucher.expenseClaim}
				<ExpenseClaim
					bind:expenseClaim={voucher.expenseClaim}
					bind:errors
					accounts={getAccountOptionsForVouchers(data.accounts)}
					bind:totalCents={wantedTotalInCents}
					unlockable={!voucher.accounted}
				/>
			{/if}
			{#if voucher.expenseReport}
				<ExpenseReport
					bind:expenseReport={voucher.expenseReport}
					bind:errors
					accounts={getAccountOptionsForVouchers(data.accounts)}
					bind:totalCents={wantedTotalInCents}
					unlockable={!voucher.accounted}
				/>
			{/if}
			{#if voucher.internalInvoice}
				<InternalInvoice
					bind:internalInvoice={voucher.internalInvoice}
					bind:errors
					accounts={getAccountOptionsForVouchers(data.accounts)}
					bind:totalCents={wantedTotalInCents}
					unlockable={!voucher.accounted}
				/>
			{/if}
			{#if voucher.salesReport}
				<SalesReport
					bind:salesReport={voucher.salesReport}
					bind:errors
					accounts={getAccountOptionsForVouchers(data.accounts)}
					bind:totalCents={wantedTotalInCents}
					unlockable={!voucher.accounted}
				/>
			{/if}
			{#if voucher.supplierInvoice}
				<SupplierInvoice
					bind:supplierInvoice={voucher.supplierInvoice}
					bind:errors
					suppliers={data.suppliers}
					unlockable={!voucher.accounted}
				/>
			{/if}
			{#if voucher.driversExpense}
				<DriversExpense
					bind:driversExpense={voucher.driversExpense}
					bind:errors
					bind:totalCents={wantedTotalInCents}
					unlockable={!voucher.accounted}
				/>
			{/if}
			{#if voucher.referenceEmail}
				<EBox>
					<EText isSmall isBold>Kontakta inlämnare via email</EText>
					<EText isSmall>{voucher.referenceEmail}</EText>
				</EBox>
			{/if}
		</div>

		{#snippet voucherFields()}
			<EInput
				className="col-span-full"
				id={FormVoucherNames.LABEL}
				label="Etikett"
				bind:value={voucher.label}
				isInvalid={!!errors[FormVoucherNames.LABEL]}
				disabled={!data.user.isPengU || voucher.accounted}
			/>
			<EInput
				className="col-span-full"
				id={FormVoucherNames.DESCRIPTION}
				label="Beskrivning"
				bind:value={voucher.description}
				isRequired
				isInvalid={!!errors[FormVoucherNames.DESCRIPTION]}
				disabled={voucher.accounted}
				isValidCallback={(v) => typeof v === "number" || v === null || (v.length <= 50)}
				errorText={max50}
			/>
			{#if !!voucher.comment}
				<ETextarea
					className="col-span-full"
					id={FormVoucherNames.COMMENT}
					label="Kommentar"
					bind:value={voucher.comment}
					isInvalid={!!errors[FormVoucherNames.COMMENT]}
					disabled={voucher.accounted}
				/>
			{/if}
			<EInput
				id={FormVoucherNames.UTSKOTT}
				label="Utskott/Mottagare"
				isRequired
				bind:value={voucher.utskott}
				dropdownContent={UTSKOTT_OPTIONS}
				isInvalid={!!errors[FormVoucherNames.UTSKOTT]}
				disabled={!data.user.canApprove || voucher.accounted}
			/>
			<EInput
				id={FormVoucherNames.SERIES}
				label="Serie"
				bind:value={voucher.series}
				dropdownContent={SERIES_OPTIONS}
				isRequired
				isInvalid={!!errors[FormVoucherNames.SERIES]}
				disabled={!data.user.isPengU || voucher.accounted}
			/>
			<EDatePicker
				id={FormVoucherNames.DATETURNEDIN}
				label="Datum inlämnad"
				bind:value={voucher.dateTurnedIn}
				disabled
				isRequired
				isInvalid={!!errors[FormVoucherNames.DATETURNEDIN]}
			/>

			{#if !!voucher.reference}
				<EInput
					id={FormVoucherNames.REFERENCE}
					label="Referens"
					bind:value={voucher.reference}
					isInvalid={!!errors[FormVoucherNames.REFERENCE]}
					disabled
				/>
			{/if}

			{#if voucher.expenseClaim}
				<EDatePicker
					id={FormExpenseClaimNames.PAYMENTDATE}
					label="Utbetalningsdatum"
					bind:value={voucher.expenseClaim.paymentDate}
					isInvalid={!!errors[FormExpenseClaimNames.PAYMENTDATE]}
					disabled={!data.user.isPengUChief || voucher.accounted}
				/>
				<EInput
					id={FormExpenseClaimNames.PAYMENTADDEDBY}
					label="Upplagd av"
					dropdownContent={[{ label: data.user.fullName, value: data.user.fullName }]}
					bind:value={voucher.expenseClaim.paymentAddedBy}
					isInvalid={!!errors[FormExpenseClaimNames.PAYMENTADDEDBY]}
					disabled={!data.user.isPengUChief || voucher.accounted}
				/>
			{/if}
			{#if voucher.driversExpense}
				<EDatePicker
					id={FormDriversExpenseNames.PAYMENTDATE}
					label="Utbetalningsdatum"
					bind:value={voucher.driversExpense.paymentDate}
					isInvalid={!!errors[FormDriversExpenseNames.PAYMENTDATE]}
					disabled={!data.user.isPengUChief || voucher.accounted}
				/>
				<EInput
					id={FormDriversExpenseNames.PAYMENTADDEDBY}
					label="Upplagd av"
					dropdownContent={[{ label: data.user.fullName, value: data.user.fullName }]}
					bind:value={voucher.driversExpense.paymentAddedBy}
					isInvalid={!!errors[FormDriversExpenseNames.PAYMENTADDEDBY]}
					disabled={!data.user.isPengUChief || voucher.accounted}
				/>
			{/if}

			<EDatePicker
				id={FormVoucherNames.TRANSACTIONDATE}
				label="Transaktionsdatum"
				bind:value={voucher.transactionDate}
				isInvalid={!!errors[FormVoucherNames.TRANSACTIONDATE]}
				disabled={!data.user.isPengU || voucher.accounted}
			/>
			<div class="col-span-full">
				{#if voucher.approvedBy}
					<EText isSmall>
						Godkänd av {voucher.approvedBy}
					</EText>
				{:else}
					<EText isSmall>
						Godkänns som {data.user.title}
					</EText>
				{/if}
			</div>
			{#if voucher.accountedBy}
				<div class="col-span-full">
					<EText isSmall>
						Bokförd av {voucher.accountedBy}
					</EText>
				</div>
			{:else if data.user.isPengU}
				<div class="col-span-full">
					<EText isSmall>
						Bokförs som {data.user.title}
					</EText>
				</div>
			{/if}
			<div class="col-span-full grid place-items-start">
				<div class="flex flex-wrap gap-2">
					{#if !voucher.accounted}
						<EButton
							formaction="?/toggleapproved"
							disabled={$formLoad || !(
									// in here it's if it's "enabled"
									data.user.isPengU || (
										data.user.canApprove &&
										!voucher.approvedBy
									)
								)}
							isSubmit
							type="secondary"
							>{voucher.approvedBy ? 'Avböj' : 'Godkänn'}
						</EButton>
						<EButton formaction="?/fortnox" disabled={!data.user.isPengU || $formLoad} isSubmit
							>Bokför</EButton
						>
						<EButton formaction="?/save" disabled={$formLoad} isSubmit>Spara</EButton>
						{#if voucher.expenseClaim || voucher.driversExpense || voucher.paid}
							<EButton
								formaction="?/togglepaid"
								disabled={!data.user.isPengUChief || $formLoad}
								isSubmit
								type="secondary">{voucher.paid ? 'Avmarkera' : 'Markera'} betald</EButton
							>
						{/if}
						<EButton
							formaction="?/togglearchived"
							disabled={!data.user.isPengUChief || $formLoad}
							isSubmit
							type="secondary">{voucher.archived ? 'Avarkivera' : 'Arkivera'}</EButton
						>
					{:else if !voucher.supplierInvoice}
						<EButton onclick={downloadVoucher} type="secondary">Ladda ner verifikat</EButton>
					{/if}
				</div>
			</div>
			{#if !deleteForSure}
				<EButton
					type="ghost"
					onclick={() => {
						notifications.add(
							'warning',
							'Du håller på att radera verifikatet',
							'Klicka på knappen igen för att bekräfta',
							5000
						);
						deleteForSure = true;
						setTimeout(() => {
							deleteForSure = false;
						}, 5000);
					}}>Radera</EButton
				>
			{:else}
				<EButton formaction="?/delete" disabled={$formLoad} isSubmit type="danger">Radera</EButton>
			{/if}
		{/snippet}
		<VoucherEditAndPreview {voucherFields} className="md:col-span-2" />
	</div>
</form>
