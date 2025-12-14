import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const _geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
    <html lang="en">
      <body className={`${_geist.variable} ${_geistMono.variable} antialiased`}>
        {/* <Navbar01 /> */}
        {children}
      </body>
    </html>
  );
}
