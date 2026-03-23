import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Miners Hub - Premium Crypto Mining Solutions in UAE & Oman",
  description: "40MW cryptocurrency mining capacity. Advanced ASIC miners with hydro, air, and immersion cooling solutions in UAE and Oman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
