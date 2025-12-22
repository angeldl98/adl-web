import { NextResponse } from "next/server";
import { execSync } from "node:child_process";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function gitCommit(): string | null {
  try {
    return execSync("git rev-parse HEAD").toString().trim();
  } catch {
    return process.env.VERCEL_GIT_COMMIT_SHA || null;
  }
}

const buildTime = process.env.BUILD_TIME || new Date().toISOString();

export async function GET() {
  return NextResponse.json({
    commit: gitCommit(),
    buildTime,
  });
}

