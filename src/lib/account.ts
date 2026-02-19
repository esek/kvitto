export function isWareAccount(account: number | string): boolean {
    return typeof account === "string" || (account >= 1000 && account < 2000) || (account >= 4000 && account < 8000)
}
