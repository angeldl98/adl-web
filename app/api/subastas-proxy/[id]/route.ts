import { NextRequest, NextResponse } from 'next/server';
import { getGatewayConfig } from '../utils';

export async function GET(req: NextRequest) {
  const segments = req.nextUrl.pathname.split('/');
  const id = segments[segments.length - 1];
  const { baseUrl, apiKey } = getGatewayConfig();
  const resp = await fetch(`${baseUrl}/api/subastas/${id}`, {
    headers: { 'x-api-key': apiKey }
  });
  const body = await resp.text();
  return new NextResponse(body, {
    status: resp.status,
    headers: { 'content-type': resp.headers.get('content-type') || 'application/json' }
  });
}

