/**
 * Process-level in-memory cache for uploaded images, so /api/img can serve
 * them instantly (avoids slow volume reads when TikTok pulls via PULL_FROM_URL,
 * which was causing photo_pull_failed). Shared singleton within the Railway
 * instance; falls back to disk on cache miss (e.g. after a restart).
 */
export const imgCache = new Map();
