import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Vedagarbha AI — Next-Gen Movie & Image Creation",
  description:
    "The world's most advanced AI creative ecosystem. Generate cinematic videos, ultra-realistic images, and human-like speech with ease."
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { AuthProvider } from "@/lib/contexts/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${space.variable} antialiased selection:bg-[#3B82F6]/30 selection:text-white`}>
        <AuthProvider>
          <AnimatedBackground />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
