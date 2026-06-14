import { NextResponse } from "next/server";
import { exchangeCodeForToken, getBaseUrl } from "../../../../lib/tiktok";

/**
 * OAuth callback — TikTok redirects here with ?code & ?state.
 * Exchanges the code for an access token, stores it in an httpOnly cookie,
 * then redirects to the dashboard.
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

    const res = NextResponse.redirect(`${origin}/dashboard`);
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
