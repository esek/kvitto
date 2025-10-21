import { headerNavbarItemsFromUrl } from '@/helpers/navigation.helpers';
import type { LayoutLoad } from './$types';

export const load = (async (event) => {
	return { ...event.data, headerItems: headerNavbarItemsFromUrl(event.url) };
}) satisfies LayoutLoad;
