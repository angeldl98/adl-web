import { NextResponse } from 'next/server';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const files = [
  '/opt/adl-suite/diagnostics/service-status.json',
  '/opt/adl-suite/diagnostics/container-status.json',
  '/opt/adl-suite/diagnostics/resource-usage.json',
  '/opt/adl-suite/diagnostics/eventbus-status.json',
  '/opt/adl-suite/diagnostics/dag-status.json',
  '/opt/adl-suite/diagnostics/adl-scripts-status.json',
  '/opt/adl-suite/diagnostics/agents-status.json'
];

export async function GET() {
  const payload: Record<string, any> = {};
  for (const file of files) {
    try {
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file, 'utf-8');
        payload[file.split('/').pop() || file] = JSON.parse(raw);
      }
    } catch (err) {
      payload[file.split('/').pop() || file] = { error: (err as any)?.message };
    }
  }
  return NextResponse.json({ diagnostics: payload });
}

