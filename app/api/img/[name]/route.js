import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIR = path.join(process.env.TOKEN_DIR || "/data", "uploads");

const TYPES = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };

/**
 * Serve an uploaded image from the persistent volume on the verified domain,
 * so TikTok can pull it via PULL_FROM_URL.
 */
export async function GET(_request, { params }) {
  const name = (params?.name || "").replace(/[^a-zA-Z0-9._-]/g, "_");
  try {
    const buf = fs.readFileSync(path.join(DIR, name));
    const ext = name.split(".").pop().toLowerCase();
    return new Response(buf, {
      headers: {
        "Content-Type": TYPES[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("not found", { status: 404 });
  }
}
