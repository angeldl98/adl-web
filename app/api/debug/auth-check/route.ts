import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword } from '@/lib/auth-db';
import { getDbPool } from '@/lib/db';

// Debug endpoint - enabled for debugging
export async function POST(req: NextRequest) {
  // Allow in all environments for debugging (can be restricted later)

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // Get DB info
    const pool = getDbPool();
    const dbInfo = await pool.query('SELECT current_database() as db_name, current_user as db_user, inet_server_addr() as db_host');
    const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
    
    // Check user
    const user = await getUserByEmail(normalizedEmail);
    const userExists = !!user;
    
    let passwordValid = false;
    let hashAlgorithm = 'unknown';
    
    if (user && user.password_hash) {
      // Detect hash algorithm
      if (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$')) {
        hashAlgorithm = 'bcrypt';
      }
      
      passwordValid = await verifyPassword(password, user.password_hash);
    }

    return NextResponse.json({
      email: normalizedEmail,
      userExists,
      passwordValid,
      hashAlgorithm,
      hashExists: !!user?.password_hash,
      hashLength: user?.password_hash?.length || 0,
      hashPrefix: user?.password_hash?.substring(0, 30) || null,
      dbInfo: {
        database: dbInfo.rows[0]?.db_name,
        user: dbInfo.rows[0]?.db_user,
        host: dbInfo.rows[0]?.db_host || 'postgres',
        userCount: parseInt(userCount.rows[0]?.count || '0'),
      },
    });
  } catch (err: any) {
    console.error('[DEBUG] Auth check error:', err);
    return NextResponse.json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}

