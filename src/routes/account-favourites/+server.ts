import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { auth } from '$lib/auth';
import { populateUser } from '@/helpers/user.helpers';
import { setAccountFavourite } from '$lib/prisma';

const preference = z.object({
	account: z.number().int().min(1000).max(9999),
	favourite: z.boolean()
});

export const POST: RequestHandler = async (event) => {
	if (event.request.headers.get('origin') !== event.url.origin) error(403, 'Ogiltigt ursprung.');
	const { user: authenticated } = await auth.serverLoad({
		...event,
		parent: async () => ({}),
		depends: () => {},
		untrack: (fn) => fn()
	});
	if (!authenticated) error(401, 'Logga in igen.');
	const user = await populateUser(authenticated);
	if (!user.verified) error(403, 'Du måste vara verifierad.');
	const parsed = preference.safeParse(await event.request.json().catch(() => null));
	if (!parsed.success) error(400, 'Ogiltigt konto eller favoritval.');
	// Never accept a username from the client: these preferences belong to the caller.
	const favourites = await setAccountFavourite(
		user.username,
		parsed.data.account,
		parsed.data.favourite
	);
	return json({ favourites }, { headers: { 'cache-control': 'private, no-store' } });
};
