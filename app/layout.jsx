export const metadata = {
  title: "MorningPower Analytics",
  description: "TikTok analytics dashboard for the MorningPower account.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          background: "#0b1220",
          color: "#e8eef9",
        }}
      >
        {children}
      </body>
    </html>
  );
}
