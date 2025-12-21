import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    const password = process.env.POSTGRES_PASSWORD;
    // Allow empty password for local/dev (Postgres may use trust auth)
    const passwordValue = password !== undefined ? password : '';
    
    if (password === undefined || password === '') {
      console.warn('⚠️ POSTGRES_PASSWORD is empty. Using empty string (may work with trust auth).');
    }
    
    pool = new Pool({
      host: process.env.POSTGRES_HOST || 'postgres',
      port: Number(process.env.POSTGRES_PORT || 5432),
      user: process.env.POSTGRES_USER || 'adl',
      password: passwordValue,
      database: process.env.POSTGRES_DB || 'adl_core',
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5000,
    });
    
    // Test connection on first pool creation
    pool.query('SELECT 1').then(() => {
      console.log('✅ Database connection successful');
    }).catch((err) => {
      console.error('❌ Database connection test failed:', err.message);
      if (err.message.includes('password') || err.message.includes('SCRAM')) {
        console.error('💡 Postgres requires a password. Set POSTGRES_PASSWORD in runtime.env');
      }
    });
  }
  return pool;
}

export async function ensureUsersTable() {
  const pool = getDbPool();
  try {
    // Check if table exists and has correct schema
    const tableCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'is_subscribed'
    `);
    
    // Create table if it doesn't exist (with UUID for compatibility)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        is_subscribed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // Add is_subscribed column if it doesn't exist
    if (tableCheck.rows.length === 0) {
      await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS is_subscribed BOOLEAN DEFAULT FALSE
      `);
    }
    
    // Ensure unique constraint on email (case-insensitive)
    // Use LOWER() function to enforce case-insensitive uniqueness
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_key ON users(LOWER(email))
    `);
    
    // Also keep the original index for compatibility
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users(email)
    `);
    
    // Create index on email for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);
  } catch (err: any) {
    console.error('ensureUsersTable error:', err.message);
    throw err;
  }
}

