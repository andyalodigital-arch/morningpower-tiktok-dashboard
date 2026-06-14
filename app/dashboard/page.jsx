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

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        {user?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar_url} alt="" width={56} height={56} style={{ borderRadius: "50%" }} />
        ) : null}
        <div>
          <h1 style={{ margin: 0, fontSize: 24 }}>{user?.display_name || "MorningPower"}</h1>
          <span style={{ color: "#8aa0c4", fontSize: 14 }}>Analytics dashboard</span>
        </div>
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
                <tr style={{ textAlign: "left", color: "#8aa0c4", borderBottom: "1px solid #1e2c49" }}>
                  <th style={{ padding: "10px 8px" }}>Post</th>
                  <th style={{ padding: "10px 8px" }}>Views</th>
                  <th style={{ padding: "10px 8px" }}>Likes</th>
                  <th style={{ padding: "10px 8px" }}>Komen</th>
                  <th style={{ padding: "10px 8px" }}>Share</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((v) => (
                  <tr key={v.id} style={{ borderBottom: "1px solid #16223b" }}>
                    <td style={{ padding: "10px 8px", maxWidth: 360 }}>
                      {v.title || v.video_description || `(${new Date((v.create_time || 0) * 1000).toLocaleDateString("id-ID")})`}
                    </td>
                    <td style={{ padding: "10px 8px" }}>{fmt(v.view_count)}</td>
                    <td style={{ padding: "10px 8px" }}>{fmt(v.like_count)}</td>
                    <td style={{ padding: "10px 8px" }}>{fmt(v.comment_count)}</td>
                    <td style={{ padding: "10px 8px" }}>{fmt(v.share_count)}</td>
                  </tr>
                ))}
                {videos.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: "16px 8px", color: "#8aa0c4" }}>Belum ada post yang ke-return.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
