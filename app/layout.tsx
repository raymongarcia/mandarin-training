import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mandarin for Work — Your practical Mandarin course",
  description:
    "Learn Standard Mandarin one practical business lesson at a time, from your first words to confident workplace conversations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
