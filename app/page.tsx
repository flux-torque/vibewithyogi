import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import Cursor from "@/components/landing2/Cursor";
import Hero from "@/components/landing2/Hero";
import Menu from "@/components/landing2/Menu";
import Sections from "@/components/landing2/Sections";
import SmoothScroll from "@/components/shared/SmoothScroll";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-j" });

export const metadata: Metadata = {
  title: "Vibe with Yogi",
  description:
    "Solo traveller. Himalayan drone films, expedition routes and brand work.",
};

export default function Home() {
  return (
    <SmoothScroll>
      <main
        id="top"
        className={`${anton.variable} ${inter.variable} ${mono.variable} grain relative isolate w-full overflow-x-clip bg-[#05070a] font-[family-name:var(--font-inter)] antialiased [&_.font-mono]:font-[family-name:var(--font-mono-j)]`}
      >
        <Cursor />
        <Menu />
        <Hero />
        <Sections />
      </main>
    </SmoothScroll>
  );
}
