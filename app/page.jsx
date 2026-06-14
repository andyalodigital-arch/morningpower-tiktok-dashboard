/**
 * Landing page — also serves as the public "Web/Desktop URL" for the TikTok app.
 * Shows what the app does and a "Login with TikTok" button.
 */
export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        <span style={{ fontSize: 34 }}>🌅</span>
        <h1 style={{ fontSize: 30, margin: 0 }}>MorningPower Analytics</h1>
      </div>
      <p style={{ color: "#9fb0cc", fontSize: 17, lineHeight: 1.7 }}>
        Dashboard internal untuk mengelola dan menganalisis konten renungan harian
        MorningPower di TikTok. Login dengan akun TikTok kamu untuk melihat statistik
        akun dan performa tiap post (views, likes, komentar, share).
      </p>

      <a
        href="/api/auth/login"
        style={{
          display: "inline-block",
          marginTop: 24,
          padding: "14px 26px",
          background: "#fe2c55",
          color: "#fff",
          textDecoration: "none",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        Login with TikTok
      </a>

      <ul style={{ marginTop: 40, color: "#9fb0cc", lineHeight: 2, fontSize: 15 }}>
        <li>📊 Statistik akun: follower, total likes, jumlah video</li>
        <li>🎬 List post + metrik per-post (views / likes / komentar / share)</li>
      </ul>

      <footer style={{ marginTop: 56, fontSize: 13, color: "#5f6f8c" }}>
        <a href="https://andyalodigital-arch.github.io/morningpower-legal/terms.html" style={{ color: "#7c9bd6" }}>
          Terms of Service
        </a>
        {"  ·  "}
        <a href="https://andyalodigital-arch.github.io/morningpower-legal/privacy.html" style={{ color: "#7c9bd6" }}>
          Privacy Policy
        </a>
      </footer>
    </main>
  );
}
