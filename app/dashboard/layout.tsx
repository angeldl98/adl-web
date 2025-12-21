import Link from 'next/link';
import '../globals.css';
import { LogoutButton } from './LogoutButton';
import { Providers } from './Providers';
import { TopbarUser } from './TopbarUser';
import { AuthGate } from './AuthGate';

const nav = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Services', href: '/dashboard/services' },
  { label: 'Engines', href: '/dashboard/engines' },
  { label: 'Brain & Agents', href: '/dashboard/brain' },
  { label: 'DAGs & Pipelines', href: '/dashboard/dags' },
  { label: 'Event Bus', href: '/dashboard/events' },
  { label: 'ADL-Script', href: '/dashboard/scripts' },
  { label: 'Diagnostics', href: '/dashboard/diagnostics' },
  { label: 'Logs & Metrics', href: '/dashboard/logs' },
  { label: 'Subastas', href: '/dashboard/subastas' },
  { label: 'Operations', href: '/dashboard/operations' },
  { label: 'Cognitive', href: '/dashboard/cognitive' }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const envLabel = process.env.NODE_ENV === 'production' ? 'Hetzner / PROD-like' : 'DEV';
  const now = new Date().toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  return (
    <Providers>
      <div className="layout">
        <aside className="sidebar">
          <h2>ADL Suite v5</h2>
          <div className="nav-section">
            {nav.map(item => (
              <Link key={item.href} href={item.href} className={`nav-item`}>
                {item.label}
              </Link>
            ))}
          </div>
        </aside>
        <div>
          <div className="topbar">
            <div>
              <span className="pill ok">Entorno: {envLabel}</span>
            </div>
            <div className="flex gap-12" style={{ alignItems: 'center' }}>
              <span className="muted">Hora: {now}</span>
              <TopbarUser />
              <LogoutButton />
            </div>
          </div>
          <div className="content">
            <AuthGate>{children}</AuthGate>
          </div>
        </div>
      </div>
    </Providers>
  );
}
