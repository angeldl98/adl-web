import { NextRequest, NextResponse } from "next/server";
import { getGatewayConfig } from "../utils";

export async function GET(req: NextRequest) {
  const { baseUrl, apiKey } = getGatewayConfig();
  const url = new URL(req.url);
  const qs = url.search;
  const target = `${baseUrl}/api/pharma/search${qs}`;
  const resp = await fetch(target, {
    headers: { "x-api-key": apiKey }
  });
  const body = await resp.text();
  return new NextResponse(body, {
    status: resp.status,
    headers: { "content-type": resp.headers.get("content-type") || "application/json" }
  });
}

