import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    is_subscribed?: boolean;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      is_subscribed?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    is_subscribed?: boolean;
  }
}

