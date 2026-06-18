import fs from "fs";
import path from "path";
import { imgCache } from "../../../../lib/imgCache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIR = path.join(process.env.TOKEN_DIR || "/data", "uploads");

const TYPES = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };

/**
 * Serve an uploaded image (memory cache first, then volume) on the verified
 * domain so TikTok can pull it fast via PULL_FROM_URL.
 */
export async function GET(_request, { params }) {
  const name = (params?.name || "").replace(/[^a-zA-Z0-9._-]/g, "_");
  let buf = imgCache.get(name);
  if (!buf) {
    try {
      buf = fs.readFileSync(path.join(DIR, name));
      imgCache.set(name, buf);
    } catch {
      return new Response("not found", { status: 404 });
    }
  }
  const ext = name.split(".").pop().toLowerCase();
  return new Response(buf, {
    headers: {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Content-Length": String(buf.length),
      "Cache-Control": "public, max-age=86400",
    },
  });
}
