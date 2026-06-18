import { NextResponse } from "next/server";
import { loadToken, saveToken } from "../../../lib/tokenStore";
import { refreshAccessToken, publishPhotoDraft } from "../../../lib/tiktok";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Upload a photo carousel to TikTok as a DRAFT, protected by ?key=METRICS_SECRET.
 * Body: { caption: string, imageUrls: string[], title?: string, coverIndex?: number }
 * Uses the server-persisted token (auto-refreshes). The post lands in the
 * creator's TikTok inbox to finish (add sound + publish).
 */
export async function POST(request) {
  const url = new URL(request.url);
  if (!process.env.METRICS_SECRET || url.searchParams.get("key") !== process.env.METRICS_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json_body" }, { status: 400 });
  }
  const { caption = "", title = "", imageUrls, coverIndex = 0 } = payload || {};
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return NextResponse.json({ error: "imageUrls (array) is required" }, { status: 400 });
  }

  let tok = loadToken();
  if (!tok || !tok.refresh_token) {
    return NextResponse.json({ error: "no_token. Login once at / first." }, { status: 400 });
  }

  try {
    if (Date.now() > (tok.expires_at || 0) - 60_000) {
      const r = await refreshAccessToken(tok.refresh_token);
      tok = {
        access_token: r.access_token,
        refresh_token: r.refresh_token || tok.refresh_token,
        expires_at: Date.now() + (r.expires_in || 86400) * 1000,
      };
      saveToken(tok);
    }

    const data = await publishPhotoDraft(tok.access_token, { caption, title, imageUrls, coverIndex });
    return NextResponse.json({ ok: true, ...data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
