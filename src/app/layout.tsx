import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "URAN’26 | National-Level Inter-Collegiate Hackathon | 26 Sept 2026 | PMIST",
  description:
    "URAN’26 — 12-Hour National-Level Inter-Collegiate Hackathon (7:00 AM – 7:00 PM) on 26 September 2026 at PMIST Campus, Vallam, Thanjavur. Think • Build • Transform.",
  keywords: [
    "URAN 26",
    "URAN'26",
    "Hackathon PMIST",
    "National Level Hackathon",
    "Department of Computer Applications",
    "Periyar Maniammai Institute of Science and Technology",
    "Thanjavur Hackathon",
    "Student Hackathon India",
    "12 Hour Hackathon"
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-slate-950 text-slate-50`}>
        {children}
      </body>
    </html>
  );
}
