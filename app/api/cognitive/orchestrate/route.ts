import { NextRequest, NextResponse } from 'next/server';

const brainBase = process.env.BRAIN_V2_URL || process.env.NEXT_PUBLIC_BRAIN_V2_URL;

export async function POST(req: NextRequest) {
  if (!brainBase) {
    return NextResponse.json({ error: 'missing_brain_url' }, { status: 500 });
  }

  const body = await req.text();

  try {
    const res = await fetch(`${brainBase}/cognitive/orchestrate`, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers.get('content-type') || 'application/json',
        'X-ADL-INTERNAL': 'true'
      },
      body,
      cache: 'no-store'
    });

    const respBody = await res.text();
    const headers = new Headers();
    const contentType = res.headers.get('content-type');
    if (contentType) headers.set('content-type', contentType);

    return new NextResponse(respBody, {
      status: res.status,
      headers
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'fetch_failed' }, { status: 500 });
  }
}


