/**
 * Minimal persistent token store (no DB).
 * Writes the TikTok OAuth token to a JSON file. Mount a Railway volume at
 * TOKEN_DIR (default /data) so it survives redeploys; otherwise it is
 * ephemeral and a re-login is needed after a restart.
 */
import fs from "fs";
import path from "path";

const DIR = process.env.TOKEN_DIR || "/data";
const FILE = path.join(DIR, "tiktok_token.json");

/**
 * Persist the token bundle.
 * @param {{access_token:string, refresh_token:string, expires_at:number}} tok
 */
export function saveToken(tok) {
  try {
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(tok), "utf8");
  } catch (err) {
    console.error("saveToken failed:", err.message);
  }
}

/**
 * Load the token bundle, or null if none stored.
 * @returns {{access_token:string, refresh_token:string, expires_at:number}|null}
 */
export function loadToken() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return null;
  }
}
