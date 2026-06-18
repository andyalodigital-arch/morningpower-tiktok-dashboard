/**
 * TikTok Display API helpers (server-side only).
 * Docs: https://developers.tiktok.com/doc/login-kit-web / display-api
 */

const AUTH_BASE = "https://www.tiktok.com/v2/auth/authorize/";
const TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const USER_INFO_URL = "https://open.tiktokapis.com/v2/user/info/";
const VIDEO_LIST_URL = "https://open.tiktokapis.com/v2/video/list/";
const POST_INIT_URL = "https://open.tiktokapis.com/v2/post/publish/content/init/";
const POST_STATUS_URL = "https://open.tiktokapis.com/v2/post/publish/status/fetch/";

/**
 * Scopes we request. First review submission = READ-ONLY for fast approval.
 * Add "video.upload" in a later revision once the read flow is approved.
 */
export const SCOPES = ["user.info.basic", "user.info.stats", "video.list"];

/**
 * Resolve the public base URL of this deployment.
 * Behind a proxy (Railway), request.url shows the internal host, so prefer an
 * explicit APP_BASE_URL env var, then forwarded headers, then the raw request.
 * @param {Request} request
 * @returns {string} origin without trailing slash, e.g. https://app.up.railway.app
 */
export function getBaseUrl(request) {
  if (process.env.APP_BASE_URL) {
    return process.env.APP_BASE_URL.replace(/\/+$/, "");
  }
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    new URL(request.url).host;
  return `${proto}://${host}`;
}

/**
 * Build the TikTok authorization URL the user is redirected to.
 * @param {string} redirectUri - Must exactly match a registered Redirect URI.
 * @param {string} state - CSRF state value.
 * @returns {string}
 */
export function buildAuthUrl(redirectUri, state) {
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY,
    scope: SCOPES.join(","),
    response_type: "code",
    redirect_uri: redirectUri,
    state,
  });
  return `${AUTH_BASE}?${params.toString()}`;
}

/**
 * Exchange an authorization code for an access token.
 * @param {string} code
 * @param {string} redirectUri
 * @returns {Promise<object>} token payload (access_token, open_id, expires_in, ...)
 */
export async function exchangeCodeForToken(code, redirectUri) {
  const body = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY,
    client_secret: process.env.TIKTOK_CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error_description || data.error || `Token exchange failed (${res.status})`);
    }
    return data;
  } catch (err) {
    throw new Error(`exchangeCodeForToken: ${err.message}`);
  }
}

/**
 * Exchange a refresh token for a fresh access token.
 * @param {string} refreshToken
 * @returns {Promise<object>} token payload (access_token, refresh_token, expires_in, ...)
 */
export async function refreshAccessToken(refreshToken) {
  const body = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY,
    client_secret: process.env.TIKTOK_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error_description || data.error || `Refresh failed (${res.status})`);
    }
    return data;
  } catch (err) {
    throw new Error(`refreshAccessToken: ${err.message}`);
  }
}

/**
 * Fetch the authenticated user's profile + stats.
 * @param {string} accessToken
 * @returns {Promise<object>}
 */
export async function getUserInfo(accessToken) {
  const fields = [
    "open_id", "union_id", "avatar_url", "display_name",
    "follower_count", "following_count", "likes_count", "video_count",
  ].join(",");

  try {
    const res = await fetch(`${USER_INFO_URL}?fields=${fields}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || json.error?.code !== "ok") {
      throw new Error(json.error?.message || `user/info failed (${res.status})`);
    }
    return json.data?.user || {};
  } catch (err) {
    throw new Error(`getUserInfo: ${err.message}`);
  }
}

/**
 * Upload a photo carousel to the creator's TikTok as a DRAFT (MEDIA_UPLOAD).
 * The post lands in the creator's TikTok inbox to finish (add sound + publish).
 * Requires the `video.upload` scope + Content Posting API. Images are pulled by
 * TikTok from public URLs that must sit under a verified domain/URL-prefix.
 *
 * NOTE: exact field names per TikTok Content Posting API — verify against the
 * sandbox on first real test; adjust if the API rejects a field.
 * @param {string} accessToken
 * @param {{caption?: string, title?: string, imageUrls: string[], coverIndex?: number}} opts
 * @returns {Promise<{publish_id: string}>}
 */
export async function publishPhotoDraft(accessToken, { caption = "", title = "", imageUrls, coverIndex = 0 }) {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    throw new Error("publishPhotoDraft: imageUrls is required");
  }
  const body = {
    post_info: {
      title: title || caption.slice(0, 90),
      description: caption,
      disable_comment: false,
    },
    source_info: {
      source: "PULL_FROM_URL",
      photo_cover_index: coverIndex,
      photo_images: imageUrls,
    },
    post_mode: "MEDIA_UPLOAD",
    media_type: "PHOTO",
  };

  try {
    const res = await fetch(POST_INIT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || json.error?.code !== "ok") {
      throw new Error(json.error?.message || `post/init failed (${res.status})`);
    }
    return json.data || {};
  } catch (err) {
    throw new Error(`publishPhotoDraft: ${err.message}`);
  }
}

/**
 * Check the status of a publish job by its publish_id.
 * @param {string} accessToken
 * @param {string} publishId
 * @returns {Promise<object>}
 */
export async function fetchPublishStatus(accessToken, publishId) {
  try {
    const res = await fetch(POST_STATUS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ publish_id: publishId }),
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || json.error?.code !== "ok") {
      throw new Error(json.error?.message || `status/fetch failed (${res.status})`);
    }
    return json.data || {};
  } catch (err) {
    throw new Error(`fetchPublishStatus: ${err.message}`);
  }
}

/**
 * List the authenticated user's videos with per-post engagement metrics.
 * @param {string} accessToken
 * @param {number} maxCount - up to 20 per page.
 * @returns {Promise<{videos: object[], cursor: number, hasMore: boolean}>}
 */
export async function listVideos(accessToken, maxCount = 20) {
  const fields = [
    "id", "title", "video_description", "create_time", "cover_image_url",
    "view_count", "like_count", "comment_count", "share_count", "duration",
  ].join(",");

  try {
    const res = await fetch(`${VIDEO_LIST_URL}?fields=${fields}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ max_count: maxCount }),
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || json.error?.code !== "ok") {
      throw new Error(json.error?.message || `video/list failed (${res.status})`);
    }
    return {
      videos: json.data?.videos || [],
      cursor: json.data?.cursor,
      hasMore: Boolean(json.data?.has_more),
    };
  } catch (err) {
    throw new Error(`listVideos: ${err.message}`);
  }
}
