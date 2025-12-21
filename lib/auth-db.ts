// Minimal auth DB helpers for NextAuth v4 baseline
import { getDbPool } from './db';
import bcrypt from 'bcryptjs';

export async function getUserByEmail(email: string) {
  const pool = getDbPool();
  const normalizedEmail = email.trim().toLowerCase();
  const result = await pool.query(
    'SELECT id, email, password_hash, is_subscribed FROM users WHERE email = $1',
    [normalizedEmail]
  );
  return result.rows[0] || null;
}

export async function createUser(email: string, passwordHash: string) {
  const pool = getDbPool();
  const normalizedEmail = email.trim().toLowerCase();
  const result = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, is_subscribed',
    [normalizedEmail, passwordHash]
  );
  return result.rows[0];
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const result = await bcrypt.compare(password, hash);
    console.log('[AUTHV4] password check result:', result);
    return result;
  } catch (err: any) {
    console.error('[AUTHV4] password verification error:', err.message);
    return false;
  }
}

