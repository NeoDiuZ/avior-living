// In-memory cache for client-fetched list pages (product grids, search results).
//
// These pages fetch their data in a `useEffect` after mount, so when a shopper
// clicks into a product and then navigates back, the list component remounts,
// starts from an empty/loading state, and refetches from scratch — losing
// whatever page of results and scroll position they were looking at. Since
// Next's App Router keeps the JS module graph alive across client-side
// navigations (it only resets on a hard reload), a plain module-level map
// survives the unmount/remount and lets the page restore instantly instead
// of re-fetching.
const cache = new Map<string, { data: unknown; scrollY: number }>();

export function getListCache<T>(key: string): { data: T; scrollY: number } | undefined {
  return cache.get(key) as { data: T; scrollY: number } | undefined;
}

export function setListCache<T>(key: string, data: T, scrollY: number): void {
  cache.set(key, { data, scrollY });
}
