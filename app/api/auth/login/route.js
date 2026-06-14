import { NextResponse } from "next/server";
import { buildAuthUrl } from "../../../../lib/tiktok";

/**
 * Kick off the TikTok OAuth flow.
 * Redirect URI is derived from the current request origin so it works on any deployment.
 */
export async function GET(request) {
  const origin = new URL(request.url).origin;
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
