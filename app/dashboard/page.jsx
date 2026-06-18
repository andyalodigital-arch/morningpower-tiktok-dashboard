import { cookies } from "next/headers";
import { getUserInfo, listVideos } from "../../lib/tiktok";

export const dynamic = "force-dynamic";

function StatCard({ label, value }) {
  return (
    <div
      style={{
        background: "#121d33",
        border: "1px solid #1e2c49",
        borderRadius: 12,
        padding: "18px 20px",
        minWidth: 130,
      }}
    >
      <div style={{ fontSize: 13, color: "#8aa0c4" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>
        {Number(value || 0).toLocaleString("id-ID")}
      </div>
    </div>
  );
}

function fmt(n) {
  return Number(n || 0).toLocaleString("id-ID");
}

/** Format a TikTok create_time (unix seconds) as WIB date + time. */
function fmtDate(createTime) {
  if (!createTime) return "-";
  try {
    return new Date(createTime * 1000).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

/** Short label for a post (first line of caption, truncated). */
function shortTitle(v) {
  const t = (v.title || v.video_description || "").trim();
  if (!t) return "(tanpa teks)";
  return t.length > 70 ? t.slice(0, 70) + "…" : t;
}

export default async function Dashboard() {
  const token = cookies().get("tt_token")?.value;

  if (!token) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px" }}>
        <p>Belum login.</p>
        <a href="/api/auth/login" style={{ color: "#fe2c55" }}>Login with TikTok</a>
      </main>
    );
  }

  let user = null;
  let videos = [];
  let err = null;
  try {
    user = await getUserInfo(token);
    const list = await listVideos(token, 20);
    videos = list.videos;
  } catch (e) {
    err = e.message;
  }

  const th = { padding: "10px 8px", textAlign: "left", color: "#8aa0c4", fontWeight: 600 };
  const thNum = { ...th, textAlign: "right" };
  const td = { padding: "10px 8px", verticalAlign: "top" };
  const tdNum = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };

  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        {user?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar_url} alt="" width={56} height={56} style={{ borderRadius: "50%" }} />
        ) : null}
        <div>
          <h1 style={{ margin: 0, fontSize: 24 }}>{user?.display_name || "MorningPower"}</h1>
          <span style={{ color: "#8aa0c4", fontSize: 14 }}>Analytics dashboard</span>
        </div>
        <a
          href="/api/auth/logout"
          style={{
            marginLeft: "auto",
            padding: "8px 16px",
            border: "1px solid #1e2c49",
            borderRadius: 8,
            color: "#cdd8ec",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          Ganti akun
        </a>
      </div>

      {err ? (
        <div style={{ background: "#3a1620", border: "1px solid #6e2436", padding: 16, borderRadius: 10, color: "#ffbcc8" }}>
          Gagal memuat data: {err}
        </div>
      ) : (
        <>
          <section style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 32 }}>
            <StatCard label="Followers" value={user?.follower_count} />
            <StatCard label="Following" value={user?.following_count} />
            <StatCard label="Total Likes" value={user?.likes_count} />
            <StatCard label="Videos" value={user?.video_count} />
          </section>

          <h2 style={{ fontSize: 18, marginBottom: 14 }}>Post terbaru ({videos.length})</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e2c49" }}>
                  <th style={{ ...th, width: 56 }}></th>
                  <th style={th}>Post</th>
                  <th style={{ ...th, whiteSpace: "nowrap" }}>Tanggal</th>
                  <th style={thNum}>Views</th>
                  <th style={thNum}>Likes</th>
                  <th style={thNum}>Komen</th>
                  <th style={thNum}>Share</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((v) => (
                  <tr key={v.id} style={{ borderBottom: "1px solid #16223b" }}>
                    <td style={td}>
                      {v.cover_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={v.cover_image_url}
                          alt=""
                          width={40}
                          height={56}
                          style={{ borderRadius: 6, objectFit: "cover", background: "#16223b" }}
                        />
                      ) : (
                        <div style={{ width: 40, height: 56, borderRadius: 6, background: "#16223b" }} />
                      )}
                    </td>
                    <td style={{ ...td, maxWidth: 380, color: "#cdd8ec" }}>{shortTitle(v)}</td>
                    <td style={{ ...td, whiteSpace: "nowrap", color: "#8aa0c4" }}>{fmtDate(v.create_time)}</td>
                    <td style={tdNum}>{fmt(v.view_count)}</td>
                    <td style={tdNum}>{fmt(v.like_count)}</td>
                    <td style={tdNum}>{fmt(v.comment_count)}</td>
                    <td style={tdNum}>{fmt(v.share_count)}</td>
                  </tr>
                ))}
                {videos.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: "16px 8px", color: "#8aa0c4" }}>Belum ada post yang ke-return.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
