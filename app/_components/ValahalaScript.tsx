"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Loads Valahala widget on all pages except /pdf-render so the widget
 * does not appear in the exported PDF.
 */
export function ValahalaScript() {
  const pathname = usePathname();

  if (pathname === "/pdf-render") {
    return null;
  }

  return (
    <Script
      src="https://valahala-widget.onrender.com/valaha-widget.iife.js"
      data-public-key="VALAHA-KEY-123456"
      strategy="afterInteractive"
    />
  );
}
