import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoldByYou - Keep Your Equity with $795 Flat Fee",
  description: "List your home for a $795 flat fee instead of 3% commission. Full MLS exposure, professional photos, and guided closing. Start your home search today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ fontFamily: '"Nunito", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
