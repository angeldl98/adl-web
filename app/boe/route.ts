import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect("/subastas", { status: 301 });
}

export async function POST() {
  return NextResponse.redirect("/subastas", { status: 301 });
}
