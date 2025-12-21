import { NextRequest, NextResponse } from "next/server";
import { getGatewayConfig } from "../../utils";

export async function GET(req: NextRequest) {
  const segments = req.nextUrl.pathname.split("/");
  const id = segments[segments.length - 2] === "documents" ? segments[segments.length - 1] : segments.pop();
  const { baseUrl, apiKey } = getGatewayConfig();
  const resp = await fetch(`${baseUrl}/api/subastas/documents/${id}/download`, {
    headers: { "x-api-key": apiKey }
  });
  const body = await resp.arrayBuffer();
  return new NextResponse(body, {
    status: resp.status,
    headers: {
      "content-type": resp.headers.get("content-type") || "application/pdf",
      "content-disposition": resp.headers.get("content-disposition") || ""
    }
  });
}

