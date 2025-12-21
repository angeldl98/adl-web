import { ensureUsersTable } from '../lib/db';
import { createUser } from '../lib/auth-db';
import bcrypt from 'bcryptjs';

async function init() {
  try {
    await ensureUsersTable();
    console.log('Users table created/verified');

    // Create a test premium user (for development)
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'test123456';
    
    try {
      const passwordHash = await bcrypt.hash(testPassword, 12);
      await createUser(testEmail, passwordHash);
      console.log(`Test user created: ${testEmail}`);
    } catch (err: any) {
      if (err.message?.includes('duplicate') || err.message?.includes('unique')) {
        console.log(`Test user already exists: ${testEmail}`);
      } else {
        throw err;
      }
    }

    // Mark test user as subscribed (manual update)
    const { getDbPool } = await import('../lib/db');
    const pool = getDbPool();
    await pool.query(
      'UPDATE users SET is_subscribed = TRUE WHERE email = $1',
      [testEmail]
    );
    console.log(`Test user marked as subscribed: ${testEmail}`);

    process.exit(0);
  } catch (err) {
    console.error('Init failed:', err);
    process.exit(1);
  }
}

init();

