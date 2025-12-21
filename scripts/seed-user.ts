import { ensureUsersTable } from '../lib/db';
import { createUser, getUserByEmail } from '../lib/auth-db';
import bcrypt from 'bcryptjs';
import { getDbPool } from '../lib/db';

async function seed() {
  try {
    await ensureUsersTable();
    
    const email = process.env.SEED_USER_EMAIL || 'test@example.com';
    const password = process.env.SEED_USER_PASSWORD || 'test123456';
    const isSubscribed = process.env.SEED_USER_SUBSCRIBED === '1';

    const existing = await getUserByEmail(email);
    if (existing) {
      console.log(`User ${email} already exists`);
      if (isSubscribed) {
        const pool = getDbPool();
        await pool.query('UPDATE users SET is_subscribed = TRUE WHERE email = $1', [email]);
        console.log(`User ${email} marked as subscribed`);
      }
    } else {
      const passwordHash = await bcrypt.hash(password, 12);
      await createUser(email, passwordHash);
      console.log(`User ${email} created`);
      if (isSubscribed) {
        const pool = getDbPool();
        await pool.query('UPDATE users SET is_subscribed = TRUE WHERE email = $1', [email]);
        console.log(`User ${email} marked as subscribed`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();

