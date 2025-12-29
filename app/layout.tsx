import type React from "react";
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Nunito,
  Ubuntu,
  Playfair_Display,
  Roboto_Slab,
  Share_Tech,
} from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
// Testing Fonts
const _geist = Geist({
  subsets: ["latin"],
});
const _geistMono = Geist_Mono({
  subsets: ["latin"],
});
const _nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});
const _ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});
const _playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const _robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const _shareTech = Share_Tech({
  subsets: ["latin"],
  weight: ["400"],
});
export const metadata: Metadata = {
  title: "CV Builder AI - Create Your CV in Minutes",
  description:
    "Create professional CVs in minutes with AI. Upload your old CV, generate new sections, and export instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        // className={`${_geistMono.className} antialiased`}

        // To test different fonts, uncomment ONE of these:
        className={`${_nunito.className} antialiased`}
        // className={`${_ubuntu.className} antialiased`}
        // className={`${_robotoSlab.className} antialiased`}
        // className={`${_shareTech.className} antialiased`}
        // className={`${_playfairDisplay.className} antialiased`}
      >
        {/* <Navbar01 /> */}
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
