export const metadata = {
  title: "Privacy Policy — MorningPower Analytics",
  description: "Privacy Policy for the MorningPower Analytics app.",
};

const wrap = { maxWidth: 760, margin: "0 auto", padding: "56px 24px", lineHeight: 1.7 };
const h2 = { fontSize: 19, marginTop: 28 };

export default function Privacy() {
  return (
    <main style={wrap}>
      <h1 style={{ fontSize: 28 }}>Privacy Policy</h1>
      <p style={{ color: "#8aa0c4", fontSize: 14 }}>Effective date: 14 June 2026</p>

      <p>
        This Privacy Policy explains how the <strong>MorningPower Analytics</strong> application (&quot;the App&quot;),
        operated by ALO Digital (&quot;we&quot;, &quot;us&quot;), handles information when connected to TikTok via
        official TikTok APIs.
      </p>

      <h2 style={h2}>1. Information We Access</h2>
      <p>
        With your authorization, the App accesses data from your own TikTok account only, which may include: basic
        profile information, account statistics (followers, likes, video count), and a list of your own videos with their
        public engagement metrics (views, likes, comments, shares). The App accesses this data solely for the
        authenticated account owner.
      </p>

      <h2 style={h2}>2. How We Use Information</h2>
      <p>
        Accessed data is used only to display and analyze the performance of our own content and, where enabled, to
        schedule and publish our own posts. We do not use the data for advertising or profiling of third parties.
      </p>

      <h2 style={h2}>3. Data Sharing</h2>
      <p>We do not sell or share your data with third parties. Data is processed only to provide the App&apos;s functionality.</p>

      <h2 style={h2}>4. Data Retention</h2>
      <p>
        We retain accessed data only as long as necessary to provide analytics. You may revoke the App&apos;s access at
        any time from your TikTok account settings.
      </p>

      <h2 style={h2}>5. Third-Party Services</h2>
      <p>The App relies on TikTok&apos;s APIs. Your use of TikTok is governed by TikTok&apos;s own Privacy Policy.</p>

      <h2 style={h2}>6. Contact</h2>
      <p>
        For questions about this Privacy Policy, contact:{" "}
        <a href="mailto:jualandishopeeyuk@gmail.com" style={{ color: "#7c9bd6" }}>
          jualandishopeeyuk@gmail.com
        </a>
      </p>

      <p style={{ marginTop: 40 }}>
        <a href="/" style={{ color: "#7c9bd6" }}>← Back to home</a>
      </p>
    </main>
  );
}
