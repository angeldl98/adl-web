import { NextResponse } from 'next/server';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';

type DbConfig = {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function getDbConfig(): DbConfig {
  const host = process.env.POSTGRES_HOST || 'adl-postgres';
  const user = process.env.POSTGRES_USER || 'postgres';
  const password = requireEnv('POSTGRES_PASSWORD');
  const database = process.env.POSTGRES_DB || 'adl_core';
  const port = Number(process.env.POSTGRES_PORT || 5432);
  return { host, user, password, database, port };
}

async function ensureSchema(client: Client) {
  await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      email text UNIQUE NOT NULL,
      password_hash text NOT NULL,
      role text NOT NULL DEFAULT 'viewer',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

export async function POST(req: Request) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const headerToken = req.headers.get('x-admin-token');
  if (!headerToken || headerToken !== adminToken) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  let payload: { email?: string; password?: string } = {};
  try {
    payload = await req.json();
  } catch (_) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { email, password } = payload;
  if (!email || !password) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const cfg = getDbConfig();
  const client = new Client(cfg);
  try {
    await client.connect();
    await ensureSchema(client);
    const hash = await bcrypt.hash(password, 12);
    await client.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, 'admin')
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin', updated_at = now();`,
      [email, hash]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 });
  } finally {
    await client.end().catch(() => undefined);
  }
}
