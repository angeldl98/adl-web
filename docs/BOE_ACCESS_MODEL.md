# BOE FREE/PRO access model

- FREE (sin login)
  - `/subastas`: listado público con stats y CTA a PRO.
  - `/subastas/[id]`: ficha ligera (identificador, estado, valor/tasación, enlace BOE, CTA a PRO).
- PRO (requiere sesión + suscripción BOE PRO activa)
  - `/subastas/pro`: listado PRO solo con subastas `estado = 'Activa'`, columnas económicas y localización, ordenable y filtrable; cada fila enlaza a `/subastas/pro/[id]`.
  - `/subastas/pro/[id]`: ficha completa (resumen ejecutivo, cronograma, económico, cargas, situación posesoria, documentos, riesgos) + botón PDF.
  - `/api/subastas/pro/[id]/pdf`: descarga informe PDF protegido.

## Autenticación y suscripciones
- Autenticación única vía NextAuth (credentials) (`pages/api/auth/[...nextauth].ts` + `lib/auth-options.ts`).
- Tabla `user_subscriptions`:
  - columnas: `user_id`, `user_email`, `service`, `plan (free|pro)`, `status (active|inactive|trialing|canceled)`, `current_period_end`.
  - acceso PRO si existe fila `service='boe' AND plan='pro' AND status='active'`.
- Helper `lib/access.ts`:
  - `hasProAccess(session, 'boe')` / `getSubscription(...)`.

## Gating
- No sesión → redirección a `/login?next=...` en rutas PRO.
- Sesión sin suscripción BOE PRO → CTA de upgrade (sin filtrar datos PRO).
- Sesión con suscripción BOE PRO → acceso a lista/detalle/PDF.
- API PDF devuelve 401/403 si no cumple requisitos.

## Consideraciones
- FREE no consulta tablas PRO ni expone datos sensibles.
- PRO consume `boe_subastas_public` + `boe_subastas_pro` + `boe_subastas_docs`.
- Proxy Caddy no hace `handle_path`; añade `Cache-Control: no-store` para `/subastas/pro*` y `/api/subastas/pro*`.

