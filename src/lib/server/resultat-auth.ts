import { error, type RequestEvent } from '@sveltejs/kit';
import { auth } from '$lib/auth';
import { populateUser } from '@/helpers/user.helpers';

export async function requireResultatUser(event: RequestEvent) {
	// Endpoints do not run layout loads; use the same permissions as the page.
	const { user: authenticated } = await auth.serverLoad({
		...event,
		parent: async () => ({}),
		depends: () => {},
		untrack: (fn) => fn()
	});
	if (!authenticated) error(401, 'Logga in i Kvitto för att visa resultat.');
	const user = await populateUser(authenticated);
	if (!user.verified || (!user.canApprove && !user.isPengU))
		error(403, 'Du saknar behörighet att visa resultat.');
	return user;
}
