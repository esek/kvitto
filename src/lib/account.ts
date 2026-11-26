export function isWareAccount(account: number | string): boolean {
	return (
		typeof account === 'string' ||
		(account >= 1000 && account < 2000) ||
		(account >= 4000 && account < 8000)
	);
}

/**
 * BAS-konton 1400-1499 är lagerkonton (varulager, pågående arbeten m.m.).
 * Dessa får inte kombineras med kostnadsställe eller projekt.
 */
export function isInventoryAccount(account: number | string | null | undefined): boolean {
	const number = Number(account);
	return !Number.isNaN(number) && number >= 1400 && number < 1500;
}
