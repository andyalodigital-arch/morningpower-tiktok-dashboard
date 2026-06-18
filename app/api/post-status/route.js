import { NextResponse } from "next/server";
import { loadToken, saveToken } from "../../../lib/tokenStore";
import { refreshAccessToken, fetchPublishStatus } from "../../../lib/tiktok";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Check a publish job status by ?id=<publish_id>, protected by ?key=METRICS_SECRET.
 * Tells us whether a draft upload succeeded, is processing, or failed (+ reason).
 */
export async function GET(request) {
  const url = new URL(request.url);
  if (!process.env.METRICS_SECRET || url.searchParams.get("key") !== process.env.METRICS_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  let tok = loadToken();
  if (!tok || !tok.refresh_token) {
    return NextResponse.json({ error: "no_token" }, { status: 400 });
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
    const data = await fetchPublishStatus(tok.access_token, id);
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
