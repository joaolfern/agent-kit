// Shared caches (Cloudflare's CDN on a custom domain) may keep public lists briefly; browsers must not,
// or a new item would stay hidden after it's created.
export const PUBLIC_LIST_CACHE = 'public, max-age=0, s-maxage=30'
export const NO_STORE = 'no-store'
