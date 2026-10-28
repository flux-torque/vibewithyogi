import type { Metadata } from "next";
import "./globals.css";

/* No fonts here: the page loads its own (Anton / Inter / JetBrains Mono), and
   anything declared at this level is preloaded on every request whether a
   single glyph uses it or not. */

export const metadata: Metadata = {
  title: "Vibe with Yogi",
  description: "Guided practice that clears the clouds and leaves you the view.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
