import { NextResponse } from "next/server";
import { buildAuthUrl, getBaseUrl } from "../../../../lib/tiktok";

/**
 * Kick off the TikTok OAuth flow.
 * Redirect URI is built from the public base URL so it matches the registered URI.
 */
export async function GET(request) {
  const origin = getBaseUrl(request);
  const redirectUri = `${origin}/api/auth/callback`;

  // Simple CSRF state (random per request).
  const state = crypto.randomUUID();

  const res = NextResponse.redirect(buildAuthUrl(redirectUri, state));
  res.cookies.set("tt_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
