import { writable } from 'svelte/store';

export type VoucherHeaderBadge = { label: string; color: string } | null;

const badge = writable<VoucherHeaderBadge>(null);

// Lets the voucher detail page surface its type badge up into the global
// navbar row (rendered by the root layout), which has no voucher context.
export const voucherHeaderBadge = {
	subscribe: badge.subscribe,
	set: (value: VoucherHeaderBadge) => badge.set(value)
};
