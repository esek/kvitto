import { HEADER_NAVBAR_ITEMS, type NavbarItem } from '@/constants/navigation.constants';

export const headerNavbarItemsFromUrl = (url: URL): NavbarItem[] => {
	const items = [];
	for (const item of HEADER_NAVBAR_ITEMS) {
		const routePattern = item.route.replace(/\*/g, '.*');
		const regex = new RegExp(`^${routePattern}$`);
		if (regex.test(url.pathname)) {
			items.push(...item.items);
		}
	}
	const seen = new Set<string>();
	const uniqueItems = items.filter((item) => {
		if (seen.has(item.href)) return false;
		seen.add(item.href);
		return true;
	});
	return uniqueItems;
};
