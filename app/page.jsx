/**
 * Landing page — the public "Website URL" for the TikTok app.
 * Describes the product and links to Login, Terms, and Privacy (same domain).
 */
export default function Home() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        <span style={{ fontSize: 34 }}>🌅</span>
        <h1 style={{ fontSize: 32, margin: 0 }}>MorningPower Analytics</h1>
      </div>
      <p style={{ color: "#9fb0cc", fontSize: 18, lineHeight: 1.7 }}>
        A content analytics tool by ALO Digital for our daily devotional TikTok account
        (@morningpower2023). It connects securely to TikTok to read our own account
        statistics and per-post performance, helping us evaluate and improve our content.
      </p>

      <a
        href="/api/auth/login"
        style={{
          display: "inline-block",
          marginTop: 24,
          padding: "14px 28px",
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

      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 20 }}>What it does</h2>
        <ul style={{ color: "#9fb0cc", lineHeight: 2, fontSize: 15 }}>
          <li>📊 Account statistics: followers, total likes, video count</li>
          <li>🎬 Per-post metrics: views, likes, comments, shares — with dates</li>
          <li>🔎 Search &amp; sort posts to spot what performs best</li>
          <li>📝 Prepare content as a draft to finish and publish in TikTok</li>
        </ul>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20 }}>Data &amp; privacy</h2>
        <p style={{ color: "#9fb0cc", fontSize: 15, lineHeight: 1.7 }}>
          We access only the authenticated owner&apos;s own TikTok data via official TikTok
          APIs, and never data belonging to other users. See our{" "}
          <a href="/privacy" style={{ color: "#7c9bd6" }}>Privacy Policy</a> for details.
        </p>
      </section>

      <footer style={{ marginTop: 56, paddingTop: 20, borderTop: "1px solid #1e2c49", fontSize: 14, color: "#5f6f8c" }}>
        <a href="/terms" style={{ color: "#7c9bd6" }}>Terms of Service</a>
        {"  ·  "}
        <a href="/privacy" style={{ color: "#7c9bd6" }}>Privacy Policy</a>
        {"  ·  "}
        <span>ALO Digital</span>
      </footer>
    </main>
  );
}
