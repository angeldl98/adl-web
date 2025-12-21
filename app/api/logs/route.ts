import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const baseDir = '/opt/adl-suite/logs/service-logs';

function listFiles() {
  if (!fs.existsSync(baseDir)) return [];
  return fs.readdirSync(baseDir).filter(f => f.endsWith('.log'));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get('file');
  const limit = Number(searchParams.get('limit') || '200');

  if (!file) {
    return NextResponse.json({ files: listFiles() });
  }

  const safePath = path.normalize(path.join(baseDir, file));
  if (!safePath.startsWith(baseDir)) {
    return NextResponse.json({ error: 'invalid_path' }, { status: 400 });
  }

  if (!fs.existsSync(safePath)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const content = fs.readFileSync(safePath, 'utf-8').trim().split('\n');
  const tail = content.slice(-limit);
  return NextResponse.json({ file, tail });
}

