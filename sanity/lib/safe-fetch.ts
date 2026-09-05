import { sanityFetch } from "./live";

/**
 * Wraps `sanityFetch` (the Live Content API's fetcher from defineLive) so
 * pages never throw and never render an empty result — falls back to
 * placeholder content instead. This matters right now specifically
 * because no real Sanity project exists yet (see .env.example): every
 * page component calls this instead of `sanityFetch` directly, so the
 * site stays fully functional with placeholder data today, and starts
 * pulling real, live-updating content automatically the moment a real
 * project ID + real documents exist — no further code changes needed at
 * that point. Uses `sanityFetch` (not the plain client) specifically so
 * real content also gets the Live Content API's real-time updates once
 * it's flowing, rather than sitting behind static/CDN caching.
 */
export async function safeSanityFetch<T>(
  query: string,
  fallback: T,
  params: Record<string, unknown> = {}
): Promise<T> {
  try {
    const { data } = await sanityFetch({ query, params });
    if (data === null || data === undefined) return fallback;
    if (Array.isArray(data) && data.length === 0) return fallback;
    return data as T;
  } catch (err) {
    console.error("Sanity fetch failed, using fallback content:", err);
    return fallback;
  }
}

/**
 * Same idea, but for detail-by-slug lookups where there's no meaningful
 * "empty array" fallback — just null-or-real-data. Used by the [slug]
 * detail pages, which each keep their own local fallback object.
 */
export async function safeSanityFetchOne<T>(
  query: string,
  params: Record<string, unknown>
): Promise<T | null> {
  try {
    const { data } = await sanityFetch({ query, params });
    return (data as T) ?? null;
  } catch (err) {
    console.error("Sanity fetch failed, using fallback content:", err);
    return null;
  }
}
