import { launchBrowser } from "@/lib/puppeteer";
import type { CV } from "@/types/types";
import type { Browser } from "puppeteer-core";



export interface PDFExportOptions {
  format?: "A4" | "Letter";
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  printBackground?: boolean;
  preferCSSPageSize?: boolean;
}

export interface PDFServiceConfig {
  defaultOptions?: PDFExportOptions;
  timeout?: number;
}


/**
 * PDF Service for exporting CVs to PDF format
 * Handles browser initialization, HTML rendering, and PDF generation
 */
export class PDFService {
  private config: PDFServiceConfig;
  private browser: Browser | null = null;

  constructor(config: PDFServiceConfig = {}) {
    this.config = {
      defaultOptions: {
        format: "A4",
        margin: {
          top: "0.5in",
          right: "0.5in",
          bottom: "0.5in",
          left: "0.5in",
        },
        printBackground: true,
        preferCSSPageSize: false,
        ...config.defaultOptions,
      },
      timeout: 30000,
      ...config,
    };
  }

  /**
   * Initialize Puppeteer browser instance
   * Reuses existing browser if available
   */
private async getBrowser() {
  if (!this.browser) {
    this.browser = await launchBrowser() as Browser;
  }
  return this.browser;
}


  /**
   * Generate PDF from CV data. Uses short URL /pdf-render?tid=... so no long query (avoids 500).
   * Waits for [data-pdf-ready] so the PDF contains the template, not the loading spinner.
   */
  async generatePDF(
    cvData: CV,
    options?: PDFExportOptions,
    requestOrigin?: string | null,
    tid?: string | null
  ): Promise<Buffer> {
    const browser = await this.getBrowser();
    if (!browser) {
      throw new Error("Failed to launch browser");
    }
    const page = await browser.newPage();

    try {
      const pdfOptions = {
        ...this.config.defaultOptions,
        ...options,
      };

      const baseUrl =
        requestOrigin ??
        process.env.NEXT_PUBLIC_BASE_URL ??
        "http://localhost:3000";

      const renderUrl = tid
        ? `${baseUrl}/pdf-render?tid=${encodeURIComponent(tid)}`
        : `${baseUrl}/pdf-render?data=${encodeURIComponent(JSON.stringify(cvData))}`;

      await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
      });

      await page.goto(renderUrl, {
        waitUntil: "networkidle0",
        timeout: this.config.timeout,
      });

      await page.waitForSelector('[data-pdf-ready="true"]', {
        timeout: 15000,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const pdf = await page.pdf({
        format: pdfOptions.format,
        margin: pdfOptions.margin,
        printBackground: pdfOptions.printBackground,
        preferCSSPageSize: pdfOptions.preferCSSPageSize,
      });

      return Buffer.from(pdf);
    } finally {
      await page.close();
    }
  }

  /**
   * Close browser instance
   * Call this when done with the service
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Singleton instance for reuse
let pdfServiceInstance: PDFService | null = null;

/**
 * Get or create PDF service instance
 */
export function getPDFService(): PDFService {
  if (!pdfServiceInstance) {
    pdfServiceInstance = new PDFService();
  }
  return pdfServiceInstance;
}
