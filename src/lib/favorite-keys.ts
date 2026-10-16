export type FavoriteKind = "trip" | "destination" | "experience"
export type FavoriteItem = { kind: FavoriteKind; id: string }
export function favoriteKey(kind: FavoriteKind, id: string) {
  return kind === "trip" ? id : `${kind}:${id}`
}
export function parseFavoriteKey(key: string): FavoriteItem | null {
  const [prefix, ...rest] = key.split(":")
  const kind = rest.length ? prefix : "trip"
  const id = rest.length ? rest.join(":") : prefix
  return ["trip", "destination", "experience"].includes(kind) && /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(id) ? { kind: kind as FavoriteKind, id } : null
}
