'use client';

import { Navigation } from '@/components/navigation';
import Link from 'next/link';

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="mx-auto max-w-2xl px-6 py-24">
        <div className="rounded-lg border border-border bg-background p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Suscribirse</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Accede a la herramienta completa de búsqueda y análisis de subastas
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-lg border border-border p-4">
              <h3 className="font-medium mb-2">Incluye:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Búsqueda y filtrado avanzado de subastas</li>
                <li>✓ Acceso a información detallada completa</li>
                <li>✓ Documentos y lotes</li>
                <li>✓ Análisis de entidades e importes</li>
                <li>✓ Explicaciones ELI10 generadas por IA</li>
              </ul>
            </div>

            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">
                El sistema de suscripciones estará disponible próximamente.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Por ahora, contacta con el administrador para activar tu cuenta premium.
              </p>
            </div>

            <div className="flex gap-4">
              <Link
                href="/subastas"
                className="flex-1 rounded border border-border bg-background px-4 py-2 text-foreground text-sm font-medium text-center hover:bg-muted"
              >
                Volver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

