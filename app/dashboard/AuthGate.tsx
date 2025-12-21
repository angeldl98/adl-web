"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const reasonMessages: Record<string, string> = {
  missing_cookie: 'No se encontró la cookie de sesión. Vuelve a iniciar sesión.',
  invalid_token: 'La sesión es inválida. Vuelve a iniciar sesión.',
  user_not_found: 'El usuario asociado a la sesión no existe.',
  unauthorized: 'Sesión no autorizada o expirada.',
  expired: 'La sesión expiró. Inicia sesión nuevamente.',
  refresh_failed: 'No se pudo refrescar la sesión. Intenta iniciar sesión de nuevo.',
  network_error: 'Error de red al validar la sesión.',
  server_error: 'Error del servidor al validar la sesión.'
};

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();
  const pathname = usePathname() || '/dashboard';

  if (status === 'loading' || loading) {
    return (
      <main className="page">
        <div className="card w-480">
          <h2>Verificando sesión...</h2>
          <p className="muted">Espere un momento mientras validamos tu sesión.</p>
        </div>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    const message = 'Sesión no válida.';
    return (
      <main className="page">
        <div className="card w-480">
          <h2>Autenticación requerida</h2>
          <p className="error">{message}</p>
          <button
            className="btn primary"
            onClick={() => router.push(`/login?reason=unauthorized&next=${encodeURIComponent(pathname)}`)}
          >
            Ir a login
          </button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}


