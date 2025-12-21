import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail, verifyPassword } from '@/lib/auth-db';

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[AUTHV4] authorize called');
        
        if (!credentials?.email || !credentials?.password) {
          console.log('[AUTHV4] Missing credentials');
          return null;
        }

        // Normalize email: trim and lowercase
        const normalizedEmail = credentials.email.trim().toLowerCase();
        console.log('[AUTHV4] normalizedEmail:', normalizedEmail);

        const user = await getUserByEmail(normalizedEmail);
        console.log('[AUTHV4] user found:', !!user);
        
        if (!user) {
          console.log('[AUTHV4] User not found');
          return null;
        }

        const isValid = await verifyPassword(credentials.password, user.password_hash);
        console.log('[AUTHV4] password valid:', isValid);
        console.log('[AUTHV4] password check result:', isValid);
        
        if (!isValid) {
          console.log('[AUTHV4] Password verification failed');
          return null;
        }

        console.log('[AUTHV4] Authentication successful for:', normalizedEmail);
        
        return {
          id: String(user.id),
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'change-this-in-production',
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});

