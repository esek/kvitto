import {
	Archive,
	ArrowLeftRight,
	BookText,
	Car,
	Coffee,
	CreditCard,
	FilePenLine,
	HandCoins,
	Home,
	Landmark,
	Mailbox,
	Receipt,
	SquareAsterisk,
	Tag,
	Truck
} from 'lucide-svelte';
import Routes from './routes.constants';
import type { Component } from 'svelte';

export type NavbarItem = {
	href: string;
	label: string;
	text: string;
	color: string;
	admin: boolean;
	icon: ConstructorOfATypedSvelteComponent | Component | null | undefined;
};

const adminVouchersItem: NavbarItem = {
	href: Routes.AdminVouchers,
	label: 'Inlämnat',
	text: 'Inlämnat',
	color: 'bg-[#575757]',
	admin: true,
	icon: Mailbox
};

const adminVoucherArchiveItem: NavbarItem = {
	href: Routes.AdminVoucherArchive,
	label: 'Arkiv',
	text: 'Arkiv',
	color: 'bg-[#575757]',
	admin: true,
	icon: Archive
};
export const NAVBAR_ITEMS: NavbarItem[] = [
	{
		href: Routes.ExpenseClaim,
		label: 'Privatutlägg',
		text: 'Privatutlägg',
		color: 'bg-voucher-expenseClaim',
		admin: false,
		icon: Receipt
	},
	{
		href: Routes.ExpenseReport,
		label: 'Sektionskort',
		text: 'Sektionskort',
		color: 'bg-voucher-expenseReport',
		admin: false,
		icon: CreditCard
	},
	{
		href: Routes.InternalInvoice,
		label: 'Internfaktura',
		text: 'Internfaktura',
		color: 'bg-voucher-internalInvoice',
		admin: false,
		icon: ArrowLeftRight
	},
	{
		href: Routes.SupplierInvoice,
		label: 'Leverantörsfaktura',
		text: 'Leverantörsfaktura',
		color: 'bg-voucher-supplierInvoice',
		admin: false,
		icon: Truck
	},
	{
		href: Routes.DriversExpense,
		label: 'Körersättning',
		text: 'Körersättning',
		color: 'bg-voucher-driversExpense',
		admin: false,
		icon: Car
	},
	{
		href: Routes.SalesReport,
		label: 'Försäljningsredovisning',
		text: 'Försäljningsredovisning',
		color: 'bg-voucher-salesReport',
		admin: false,
		icon: HandCoins
	},
	{
		href: Routes.LedReport,
		label: 'LED Veckorapport',
		text: 'LED Veckorapport',
		color: 'bg-voucher-salesReport',
		admin: true,
		icon: Coffee
	},
	{
		href: Routes.AccountingOrder,
		label: 'Bokföringsorder',
		text: 'Bokföringsorder',
		color: 'bg-voucher-accountingOrder',
		admin: false,
		icon: FilePenLine
	},
	adminVouchersItem,
	{
		href: Routes.AdminAccounts,
		label: 'Konton',
		text: 'Konton',
		color: 'bg-[#575757]',
		admin: true,
		icon: BookText
	},
	{
		href: Routes.AdminProfitCenters,
		label: 'Kostnadsställen',
		text: 'Kostnadsställen',
		color: 'bg-[#575757]',
		admin: true,
		icon: Landmark
	},
	{
		href: Routes.AdminProjects,
		label: 'Projekt',
		text: 'Projekt',
		color: 'bg-[#575757]',
		admin: true,
		icon: Tag
	},
	{
		href: Routes.Fortnox,
		label: 'Fortnox',
		text: 'Fortnox',
		color: 'bg-[#003824]',
		admin: true,
		icon: Tag
	},
	adminVoucherArchiveItem,
	{
		href: Routes.AdminInfo,
		label: 'Information',
		text: 'Information',
		color: 'bg-[#575757]',
		admin: true,
		icon: SquareAsterisk
	}
];

export const HEADER_NAVBAR_ITEMS: { route: string; items: NavbarItem[] }[] = [
	{
		route: '/*',
		items: [
			{
				href: Routes.Home,
				label: 'Hem',
				text: 'Hem',
				color: 'bg-transparent',
				admin: false,
				icon: Home
			}
		]
	},
	{
		route: '/admin/vouchers*',
		items: [adminVouchersItem, adminVoucherArchiveItem]
	}
];
