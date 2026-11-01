import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Little Mandarin — Learn at your own pace",
  description:
    "Learn Mandarin your way with playful lessons for kids and families, everyday conversations for casual learners, or professional business practice.",
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
