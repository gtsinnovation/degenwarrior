import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Degen Warrior — Building the Community",
  description: "Pre-launch. Building the army. Degen Warrior is forged from resilience, not hype.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="scanlines" />
        {children}
      </body>
    </html>
  );
}
