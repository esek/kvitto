import { getResultatConnection } from './resultat-connection';
import { reportClient } from './resultat';
import { voucherCache, voucherCacheKey } from './resultat-cache';

const stockholmDate = new Intl.DateTimeFormat('sv-SE', {
	timeZone: 'Europe/Stockholm',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit'
});

// Find the next local date boundary rather than adding 24 hours: Swedish days
// can be 23 or 25 hours when daylight saving time changes.
function nextMidnight(now: number) {
	const today = stockholmDate.format(now);
	let lower = now;
	let upper = now + 26 * 60 * 60 * 1000;
	while (upper - lower > 1) {
		const middle = Math.floor((lower + upper) / 2);
		if (stockholmDate.format(middle) === today) lower = middle;
		else upper = middle;
	}
	return upper;
}

async function refreshLatestYears() {
	const connection = await getResultatConnection();
	if (!connection) return;
	const { api, id } = connection;
	const year = (await reportClient(api).years())[0];
	if (!year) return;
	await voucherCache.get(
		voucherCacheKey(id, year),
		(progress) => reportClient(api, progress).vouchers(year),
		() => {},
		{ refresh: true }
	);
}

let timer: ReturnType<typeof setTimeout> | undefined;
let started = false;

export function startReportScheduler() {
	if (started) return;
	started = true;
	function schedule() {
		if (!started) return;
		const delay = Math.max(1, nextMidnight(Date.now()) - Date.now());
		timer = setTimeout(() => {
			void refreshLatestYears()
				.catch((cause: unknown) => {
					console.error(
						'[resultat] Midnattsjobbet avbröts:',
						cause instanceof Error ? cause.message : 'Okänt fel'
					);
				})
				.finally(schedule);
		}, delay);
		timer.unref();
	}
	schedule();
}

// Do not leave an old timer running after a development hot reload.
if (import.meta.hot)
	import.meta.hot.dispose(() => {
		started = false;
		if (timer) clearTimeout(timer);
	});
