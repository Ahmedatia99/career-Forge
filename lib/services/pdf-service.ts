import puppeteer from "puppeteer";
import type { CV } from "@/types/types";

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
  private browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

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
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
        ],
      });
    }
    return this.browser;
  }


  /**
   * Generate PDF from CV data
   * @param cvData - CV data to export
   * @param options - PDF export options
   * @returns PDF buffer
   */
  async generatePDF(cvData: CV, options?: PDFExportOptions): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      const pdfOptions = {
        ...this.config.defaultOptions,
        ...options,
      };

      // Encode CV data for URL
      const encodedData = encodeURIComponent(JSON.stringify(cvData));
      
      // Get the base URL - in production this should be your actual domain
      // For development, use localhost
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const renderUrl = `${baseUrl}/pdf-render?data=${encodedData}`;

      // Navigate to the render page and wait for it to load
      await page.goto(renderUrl, {
        waitUntil: "networkidle0",
        timeout: this.config.timeout,
      });

      // Wait for the CV content to be rendered (check if template is loaded)
      try {
        await page.waitForSelector('div[class*="bg-white"]', {
          timeout: 5000,
        });
      } catch {
        // If selector not found, just wait a bit
      }

      // Wait a bit more for any dynamic content, fonts, or animations
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate PDF
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
