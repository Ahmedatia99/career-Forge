import type React from "react";
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Nunito,
  Ubuntu,
  Playfair_Display,
  Roboto_Slab,
} from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
// Testing Fonts
const _geist = Geist({
  subsets: ["latin"],
});
const _geistMono = Geist_Mono({
  subsets: ["latin"],
});
const _nunito = Nunito({
  subsets: ["latin"],
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
        className={`
        ${_geist.className}
        ${_geistMono.className}
        ${_nunito.className}
        ${_ubuntu.className}
        ${_playfairDisplay.className}
        ${_robotoSlab.className}
        antialiased`}
      >
        {/* <Navbar01 /> */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
