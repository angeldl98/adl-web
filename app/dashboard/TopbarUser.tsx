"use client";

import { useSession } from 'next-auth/react';

export function TopbarUser() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const loading = status === 'loading';

  if (loading) return <span className="muted">Verificando sesión...</span>;
  if (!user) return <span className="muted">Sesión no válida</span>;

  return (
    <span className="muted">
      Usuario: {user?.email || user?.id || 'N/A'}
    </span>
  );
}


