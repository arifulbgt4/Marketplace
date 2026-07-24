import { NextRequest, NextResponse } from "next/server";

import { adminReportingService } from "src/lib/services/admin-reporting";

function csv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const cell = (value: unknown) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [
    headers.map(cell).join(","),
    ...rows.map((row) => headers.map((key) => cell(row[key])).join(",")),
  ].join("\n");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const result = await adminReportingService.report({
    type: searchParams.get("type") || undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
    currency: searchParams.get("currency") || undefined,
    timezone: searchParams.get("timezone") || undefined,
  });
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  if (searchParams.get("format") === "csv") {
    const data = result.data as { type: string; rows: Record<string, unknown>[] };
    return new NextResponse(csv(data.rows), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${data.type}-report.csv"`,
      },
    });
  }
  return NextResponse.json(result.data);
}
