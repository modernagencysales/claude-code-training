import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Code Training - Learn to Build with AI",
  description: "An interactive training platform that teaches you to use Claude Code effectively by building something actually useful for your business.",
  keywords: ["Claude Code", "AI", "coding", "training", "tutorial", "automation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
