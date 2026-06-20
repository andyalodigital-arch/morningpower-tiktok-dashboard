export const metadata = {
  title: "Terms of Service — MorningPower Analytics",
  description: "Terms of Service for the MorningPower Analytics app.",
};

const wrap = { maxWidth: 760, margin: "0 auto", padding: "56px 24px", lineHeight: 1.7 };
const h2 = { fontSize: 19, marginTop: 28 };

export default function Terms() {
  return (
    <main style={wrap}>
      <h1 style={{ fontSize: 28 }}>Terms of Service</h1>
      <p style={{ color: "#8aa0c4", fontSize: 14 }}>Effective date: 14 June 2026</p>

      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of the <strong>MorningPower Analytics</strong>{" "}
        application (&quot;the App&quot;), operated by ALO Digital (&quot;we&quot;, &quot;us&quot;). The App is used to
        manage and analyze content for our own TikTok account (@morningpower2023), including reading our own account
        performance statistics through official TikTok APIs.
      </p>

      <h2 style={h2}>1. Use of the App</h2>
      <p>
        The App is intended for internal content management of our own social media account. You agree to use the App
        only for lawful purposes and in compliance with TikTok&apos;s Terms of Service and Developer Policies.
      </p>

      <h2 style={h2}>2. TikTok Integration</h2>
      <p>
        The App connects to TikTok using official TikTok APIs and OAuth authorization. It accesses only the data of the
        authenticated account owner and does not access data belonging to other users.
      </p>

      <h2 style={h2}>3. No Warranty</h2>
      <p>
        The App is provided &quot;as is&quot; without warranties of any kind. We are not responsible for any loss arising
        from use of the App or from changes to third-party APIs.
      </p>

      <h2 style={h2}>4. Changes</h2>
      <p>
        We may update these Terms from time to time. Continued use of the App after changes constitutes acceptance of the
        updated Terms.
      </p>

      <h2 style={h2}>5. Contact</h2>
      <p>
        For questions about these Terms, contact:{" "}
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
