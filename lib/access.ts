import { getDbPool } from "./db";
import type { Session } from "next-auth";

export type Subscription = {
  user_id: string | null;
  user_email: string;
  service: string;
  plan: string;
  status: string;
  current_period_end: Date | null;
};

export async function getSubscription(session: Session | null, service = "boe"): Promise<Subscription | null> {
  if (!session?.user?.email) return null;
  const email = session.user.email.trim().toLowerCase();
  const pool = getDbPool();
  const res = await pool.query(
    `
      SELECT user_id, user_email, service, plan, status, current_period_end
      FROM user_subscriptions
      WHERE service = $1 AND LOWER(user_email) = LOWER($2)
      LIMIT 1
    `,
    [service, email]
  );
  return res.rows[0] || null;
}

export async function hasProAccess(session: Session | null, service = "boe"): Promise<boolean> {
  const sub = await getSubscription(session, service);
  if (!sub) return false;
  return sub.plan === "pro" && sub.status === "active";
}

