# ADL Web – BOE Audit (Phase A)

## Running commits (available info)
| Service | Repo path | Observed commit | Build time | Notes |
| --- | --- | --- | --- | --- |
| adl-web | /opt/adl-suite/adl-web | `git rev-parse HEAD` locally (state aligned) | N/A (runtime) | VPS container commit not verifiable from here; use `/api/version` at runtime. |
| core-auth / gateway / api | N/A (not inspected) | unknown | unknown | Need container access to read `git rev-parse HEAD` or exposed version endpoint. |

Use the new `/api/version` in adl-web to assert runtime commit/build once deployed.

## Route map (Next.js app router)
Active:
- `/subastas` → `app/subastas/page.tsx` (public FREE list; calls `/api/boe/subastas/free`)
- `/dashboard/subastas` → `app/dashboard/subastas/page.tsx` (PRO list; calls `/api/boe/subastas/pro`, auth via `adal_auth`/core-auth)
- `/boe` → `app/boe/route.ts` (301 redirect to `/subastas`)

Other existing pages (non-BOE): `/`, `/login`, `/register`, `/pharma`, `/dashboard/*` (brain, operations, etc.), `/services/adl-subastas` (legacy informational).

Legacy/Dead (mark for cleanup after replacement is live):
- `/subastas/[idSub]` and `/subastas/[subastaId]` detail pages currently hit `/api/boe/${id}` which is not wired; legacy. Should be replaced or removed once BOE detail API is defined.
- `/services/adl-subastas` page is informational; verify if still needed.

## API map (BOE)
Active (new):
- `/api/boe/subastas/free` → `app/api/boe/subastas/free/route.ts`
  - DB: `boe_subastas_public`
  - Auth: none (public)
  - Fields: id, referencia, provincia, tipo_subasta, estado, fecha_apertura, tipo_bien, valor_subasta, resumen (LEFT(descripcion, 300))
  - Order: fecha_apertura DESC (fallback normalized_at), pagination via limit/offset

- `/api/boe/subastas/pro` → `app/api/boe/subastas/pro/route.ts`
  - DB: `boe_subastas_public`
  - Auth: core-auth cookie `adal_auth` (verify via `/auth/verify`)
  - Fields: FREE fields + descripcion, importe_deposito, cargas, notas_registrales, enlace_boe (explicit select)
  - Order/pagination same as FREE

Legacy (kept until migration):
- `/api/subastas-proxy` → `app/api/subastas-proxy/route.ts` (forwards to external gateway `/api/subastas`)
- `/api/subastas-proxy/stats` (utils) used by old `/subastas` page before refactor.

Observability:
- `/api/version` → `app/api/version/route.ts` (returns commit + buildTime)

## DB map / data check
Target table for web: `boe_subastas_public` (single source of truth for FREE/PRO).
Check attempts:
- Host `postgres`: DNS EAI_AGAIN (likely container network not reachable from host).
- Host `localhost`: SCRAM error (password empty/unknown).
=> DB connectivity from this environment not established; unable to confirm row counts. Need correct DB host/creds (POSTGRES_HOST/USER/PASSWORD/DB) to verify contents and normalized_at.

Normalization pipeline:
- Expected: scraper writes RAW → normalizer writes `boe_subastas_public`.
- If UI shows empty, most likely `boe_subastas_public` is empty or DB env points elsewhere. Need to run normalizer against the production DB or adjust env to correct DSN.

## Root cause of “Sin resultados” in UI (current evidence)
- Web now queries `/api/boe/subastas/free` which reads `boe_subastas_public`.
- Local check could not reach the DB; likely the production instance either:
  - Uses different DB host/creds not available here, or
  - `boe_subastas_public` is empty because the normalizer hasn’t run on prod DB.
- UI now shows a banner when list is empty explaining that `boe_subastas_public` may be empty/not yet synchronized.

## Minimal fix list (no refactor)
1) Provide/confirm DB credentials and host for adl-web; verify `boe_subastas_public` exists and has rows (count + max(normalized_at)).
2) Run normalizer (adl-boe-raw-scraper `scripts/boe/normalize.ts`) against the production DB to populate `boe_subastas_public`.
3) Ensure core-auth is reachable from adl-web so `/api/boe/subastas/pro` auth works (cookie `adal_auth`).
4) Once data present, verify:
   - `/api/boe/subastas/free` returns rows without auth
   - `/api/boe/subastas/pro` returns rows with auth and 401 without auth
   - `/subastas` shows data; `/dashboard/subastas` shows full data.

## Single-truth notes
- Web MUST read only `boe_subastas_public` (no RAW access).
- FREE vs PRO is API-level projection of the same table (no duplicate tables).
- Legacy `/boe` already redirects to `/subastas`; keep until sitemap/SEO updated, then remove legacy routes after verification.

