import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { loadToken, saveToken } from "../../../lib/tokenStore";
import { refreshAccessToken, getUserInfo, listVideos } from "../../../lib/tiktok";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN_DIR = process.env.TOKEN_DIR || "/data";

/** Probe whether the token directory exists and is writable (for diagnostics). */
function diagnose() {
  const info = { dir: TOKEN_DIR, exists: false, writable: false, files: [], error: null };
  try {
    info.exists = fs.existsSync(TOKEN_DIR);
    if (info.exists) info.files = fs.readdirSync(TOKEN_DIR);
    const probe = path.join(TOKEN_DIR, ".probe");
    fs.mkdirSync(TOKEN_DIR, { recursive: true });
    fs.writeFileSync(probe, "ok");
    fs.unlinkSync(probe);
    info.writable = true;
  } catch (e) {
    info.error = e.message;
  }
  return info;
}

/**
 * Machine-readable metrics pull, protected by ?key=METRICS_SECRET.
 * Uses the server-persisted token (auto-refreshes when expired) so it can be
 * called headlessly without a browser session.
 */
export async function GET(request) {
  const url = new URL(request.url);
  if (!process.env.METRICS_SECRET || url.searchParams.get("key") !== process.env.METRICS_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let tok = loadToken();
  if (!tok || !tok.refresh_token) {
    return NextResponse.json(
      { error: "no_token. Login once at / to populate the token store.", diag: diagnose() },
      { status: 400 }
    );
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

    const [user, list] = await Promise.all([
      getUserInfo(tok.access_token),
      listVideos(tok.access_token, 20),
    ]);

    return NextResponse.json({
      user,
      videos: list.videos,
      count: list.videos.length,
      fetched_at: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
