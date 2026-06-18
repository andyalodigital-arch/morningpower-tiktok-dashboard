import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getBaseUrl } from "../../../lib/tiktok";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIR = path.join(process.env.TOKEN_DIR || "/data", "uploads");

/**
 * Receive an image upload (multipart form field "file"), store it on the
 * persistent volume, and return its public URL (served by /api/img/<name>).
 * Protected by ?key=METRICS_SECRET. Used by the local post-to-draft pipeline
 * so carousel images live on the verified Railway domain for pull_by_url.
 */
export async function POST(request) {
  const url = new URL(request.url);
  if (!process.env.METRICS_SECRET || url.searchParams.get("key") !== process.env.METRICS_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "no file" }, { status: 400 });
    }
    const raw = (form.get("name") || file.name || `img_${Date.now()}`).toString();
    const name = raw.replace(/[^a-zA-Z0-9._-]/g, "_");

    fs.mkdirSync(DIR, { recursive: true });
    const buf = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(DIR, name), buf);

    return NextResponse.json({ ok: true, name, url: `${getBaseUrl(request)}/api/img/${name}` });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
