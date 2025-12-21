"use client";

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {
      // ignore
    } finally {
      window.location.href = '/login';
    }
  };

  return (
    <button className="btn" onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
}
