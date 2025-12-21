import { NextResponse } from 'next/server';
import { getGatewayConfig } from '../utils';

export async function GET() {
  const { baseUrl, apiKey } = getGatewayConfig();
  const resp = await fetch(`${baseUrl}/api/subastas/stats`, {
    headers: { 'x-api-key': apiKey }
  });
  const body = await resp.text();
  return new NextResponse(body, {
    status: resp.status,
    headers: { 'content-type': resp.headers.get('content-type') || 'application/json' }
  });
}

