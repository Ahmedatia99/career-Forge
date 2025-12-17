import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geist = Geist({
  subsets: ["latin"],
});
const _geistMono = Geist_Mono({
  subsets: ["latin"],
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
        className={`${_geist.className} ${_geistMono.className} antialiased`}
      >
        {/* <Navbar01 /> */}
        {children}
      </body>
    </html>
  );
}
