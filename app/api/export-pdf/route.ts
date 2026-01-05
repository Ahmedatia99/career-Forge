import { NextRequest, NextResponse } from "next/server";
import { getPDFService } from "@/services/pdf-service";
import type { CV } from "@/types/types";

/**
 * POST /api/export-pdf
 * Exports CV data to PDF format
 *
 * Request body:
 * {
 *   cvData: CV,
 *   options?: {
 *     format?: 'A4' | 'Letter',
 *     margin?: { top?, right?, bottom?, left? },
 *     printBackground?: boolean
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cvData, options } = body;

    // Validate CV data
    if (!cvData || typeof cvData !== "object") {
      return NextResponse.json(
        { error: "Invalid CV data provided" },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdfService = getPDFService();
    const pdfBuffer = await pdfService.generatePDF(cvData as CV, options);

    // Return PDF as response
    // Convert Buffer to Uint8Array for NextResponse compatibility
    const uint8Array = new Uint8Array(pdfBuffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${(
          cvData.title || "CV"
        ).replace(/[^a-z0-9]/gi, "_")}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to export PDF." },
    { status: 405 }
  );
}
