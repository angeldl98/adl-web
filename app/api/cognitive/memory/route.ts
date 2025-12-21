import { NextRequest, NextResponse } from 'next/server';

const brainBase = process.env.BRAIN_V2_URL || process.env.NEXT_PUBLIC_BRAIN_V2_URL;

export async function GET(_req: NextRequest) {
  if (!brainBase) return NextResponse.json({ error: 'missing_brain_url' }, { status: 500 });

  try {
    const res = await fetch(`${brainBase}/cognitive/memory`, {
      method: 'GET',
      headers: { 'X-ADL-ROLE': 'brain' },
      cache: 'no-store'
    });
    const body = await res.text();
    const headers = new Headers();
    const contentType = res.headers.get('content-type');
    if (contentType) headers.set('content-type', contentType);
    return new NextResponse(body, { status: res.status, headers });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'fetch_failed' }, { status: 500 });
  }
}


