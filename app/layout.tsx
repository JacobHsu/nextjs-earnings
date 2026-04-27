import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "財報日曆 | Polymarket 數據",
  description: "追蹤各公司財報發布日期與市場對超預期的概率預測，數據來源自 Polymarket。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0d0e14]" suppressHydrationWarning>{children}</body>
    </html>
  );
}
