import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ensureUsersTable } from "./db";
import { getUserByEmail, verifyPassword } from "./auth-db";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await ensureUsersTable();
        const email = credentials.email.trim().toLowerCase();
        const user = await getUserByEmail(email);
        if (!user) return null;
        const valid = await verifyPassword(credentials.password, user.password_hash);
        if (!valid) return null;
        return { id: String(user.id), email: user.email };
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      if ((user as any)?.id) token.id = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (token?.email) {
        session.user = session.user || {};
        session.user.email = token.email as string;
      }
      if (token?.id) {
        session.user = session.user || {};
        (session.user as any).id = token.id as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "change-this-in-production"
};

