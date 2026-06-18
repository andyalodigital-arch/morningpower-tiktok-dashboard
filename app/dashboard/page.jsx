import { cookies } from "next/headers";
import { getUserInfo, listVideos } from "../../lib/tiktok";
import PostTable from "./PostTable";

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

          <PostTable videos={videos} />
        </>
      )}
    </main>
  );
}
