import { NextRequest, NextResponse } from "next/server";
import { takePdfExportData } from "@/lib/pdf-export-store";

/**
 * GET /api/pdf-data?tid=...
 * Returns CV data stored for PDF export (used by /pdf-render when loading with ?tid=).
 * Consumes the data so it is only available once.
 */
export async function GET(request: NextRequest) {
  const tid = request.nextUrl.searchParams.get("tid");
  if (!tid) {
    return NextResponse.json(
      { error: "Missing tid parameter" },
      { status: 400 }
    );
  }

  const cvData = takePdfExportData(tid);
  if (!cvData) {
    return NextResponse.json(
      { error: "Export data not found or already consumed" },
      { status: 404 }
    );
  }

  return NextResponse.json(cvData);
}
