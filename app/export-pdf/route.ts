import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getPDFService } from "@/services/pdf-service";
import { setPdfExportData } from "@/lib/pdf-export-store";
import type { CV } from "@/types/types";

/**
 * POST /export-pdf
 * Exports CV to PDF using Puppeteer. Stores CV by short id so URL is small (avoids 500).
 */
export async function POST(request: NextRequest) {
  let tid: string | undefined;
  try {
    const body = await request.json();
    const { cvData, options } = body;

    if (!cvData || typeof cvData !== "object") {
      return NextResponse.json(
        { error: "Invalid CV data provided" },
        { status: 400 }
      );
    }

    const origin =
      request.nextUrl?.origin ??
      (request.headers.get("x-forwarded-proto") && request.headers.get("host")
        ? `${request.headers.get("x-forwarded-proto")}://${request.headers.get("host")}`
        : null) ??
      "http://localhost:3000";

    tid = randomUUID();
    setPdfExportData(tid, cvData as CV);

    const pdfService = getPDFService();
    const pdfBuffer = await pdfService.generatePDF(
      cvData as CV,
      options,
      origin,
      tid
    );

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


export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to export PDF." },
    { status: 405 }
  );
}
