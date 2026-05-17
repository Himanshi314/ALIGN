import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALIGN — Where Goals Become Measurable Momentum",
  description: "A premium Performance Command Center for strategic goal setting, quarterly tracking, and organizational alignment. Powered by AI insights.",
  keywords: ["goal tracking", "OKR", "performance management", "alignment"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;600;700&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
