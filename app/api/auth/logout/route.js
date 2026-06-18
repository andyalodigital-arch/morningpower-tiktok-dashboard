import { NextResponse } from "next/server";
import { getBaseUrl } from "../../../../lib/tiktok";

export const runtime = "nodejs";

/**
 * Log out: clear the browser session cookie and return to the landing page,
 * where the user can "Login with TikTok" again as a different account.
 * The next successful login overwrites the server-persisted token, so this
 * also serves as the "switch account" flow.
 */
export async function GET(request) {
  const origin = getBaseUrl(request);
  const res = NextResponse.redirect(`${origin}/?loggedout=1`);
  res.cookies.delete("tt_token");
  return res;
}
