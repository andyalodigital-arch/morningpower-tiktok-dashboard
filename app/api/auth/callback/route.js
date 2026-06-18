import { NextResponse } from "next/server";
import { exchangeCodeForToken, getBaseUrl } from "../../../../lib/tiktok";
import { saveToken, loadToken } from "../../../../lib/tokenStore";

export const runtime = "nodejs";

/**
 * OAuth callback — TikTok redirects here with ?code & ?state.
 * Exchanges the code for an access token, stores it in an httpOnly cookie
 * (for the dashboard) AND persists it server-side (for the /api/metrics pull),
 * then redirects to the dashboard with ?login=ok|savefail for verification.
 */
export async function GET(request) {
  const origin = getBaseUrl(request);
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error)}`);
  }
  if (!code) {
    return NextResponse.redirect(`${origin}/?error=missing_code`);
  }

  // Validate CSRF state against the cookie set at login.
  const savedState = request.cookies.get("tt_state")?.value;
  if (!savedState || savedState !== state) {
    return NextResponse.redirect(`${origin}/?error=state_mismatch`);
  }

  try {
    const redirectUri = `${origin}/api/auth/callback`;
    const token = await exchangeCodeForToken(code, redirectUri);

    // Persist server-side so /api/metrics can pull without a browser session.
    saveToken({
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_at: Date.now() + (token.expires_in || 86400) * 1000,
    });
    // Verify the write actually landed (volume/permission sanity check).
    const persisted = loadToken();
    const loginStatus = persisted && persisted.refresh_token ? "ok" : "savefail";

    const res = NextResponse.redirect(`${origin}/dashboard?login=${loginStatus}`);
    res.cookies.set("tt_token", token.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: token.expires_in || 86400,
      path: "/",
    });
    res.cookies.delete("tt_state");
    return res;
  } catch (err) {
    return NextResponse.redirect(
      `${origin}/?error=${encodeURIComponent(err.message)}`
    );
  }
}
