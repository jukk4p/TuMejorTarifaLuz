# Plan de migración: Firebase → Postgres + Auth.js

Estado: **plan aprobado, pendiente de ejecución.** Este documento es la referencia para la próxima sesión — no se ha tocado código todavía.

## 1. Contexto — qué usa Firebase hoy realmente

Auditoría del código (no del diseño ideal, del código tal cual está):

- **Firestore + Auth vía SDK cliente únicamente.** Sin Firebase Admin SDK, sin Cloud Functions, sin Firebase Hosting.
- **Storage de Firebase: no se usa.** Los ficheros (facturas) ya van a Cloudflare R2.
- **Despliegue: Docker propio en Coolify** (no Vercel, no Firebase Hosting) — por eso no aplican restricciones de "uso comercial" de planes gratuitos de hosting de terceros.
- Colecciones Firestore en uso: `users/{uid}` (perfil + favoritos), `users/{uid}/settings/consumption`, `users/{uid}/billInputs/{id}` (historial de estudios), `roles_admin/{uid}` (flag admin, solo existencia), `notifications/{id}` (con `onSnapshot` en campana/página/admin), `system_state/tariffs_snapshot`, `contacts/{id}`.
- La colección `tariffs` de Firestore existe pero está **huérfana** (ver sección 3).
- **Gap de seguridad existente**: no hay verificación de sesión en servidor. `AdminGuard` es solo cliente; las rutas admin usan una `ADMIN_API_KEY` estática en vez de verificar un token real. La migración lo arregla de regalo.

## 2. Stack elegido: Postgres + Auth.js — no un BaaS

Se descartó reemplazar Firebase por otro BaaS (Supabase / PocketBase) porque la superficie real a cubrir es pequeña y la app **ya** escribe sus propias rutas/server actions para todo (upload, delete, extract, contacto, admin) — no depende de una API auto-generada, ni de Storage de terceros, ni de un Studio/admin UI genérico.

**Elegido:**
- **Postgres** — un solo contenedor en Coolify (plantilla one-click). Volumen de datos es mínimo; nada que ver con los ~9 contenedores / 4GB+ RAM que pide Supabase self-hosted.
- **Auth.js v5** (antes NextAuth) — email/password + Google OAuth de fábrica, middleware nativo de Next.js para sesión verificada en servidor.
- **Prisma o Drizzle** como ORM (decidir cuál en la sesión de implementación).

**Alternativas consideradas y descartadas por ahora:** Supabase (gestionado o self-hosted), PocketBase — quedan como plan B si en el futuro se prefiere un backend con más batería incluida a cambio de más infraestructura corriendo.

## 3. Hallazgo: las tarifas también entran en el alcance

El usuario pidió no depender más de `src/lib/data.json`. Al investigar, se encontraron **tres mecanismos distintos de "editar tarifas", de los cuales solo uno funciona**:

1. `src/app/admin/dashboard/tarifas/page.tsx` — editor completo (modal) que escribe en la colección Firestore `tariffs`. **Muerto**: `useTariffs.ts` nunca lee de Firestore, así que estos guardados no afectan lo que ve el usuario.
2. `src/app/api/admin/tariffs/route.ts` — API protegida con `ADMIN_API_KEY` que hace `fs.writeFileSync` sobre `data.json`. **Muerta**: nadie la llama desde el frontend, y aunque se llamara no serviría de nada porque `data.json` se importa de forma estática (`import tariffsData from './data.json'`) y Next.js lo empaqueta en build-time — escribirlo en runtime no cambia nada hasta el próximo deploy, y en Coolify el filesystem del contenedor no persiste entre despliegues.
3. Editar `data.json` a mano + commit + push — **el único que funciona hoy**. Dispara además `.github/workflows/social-notify.yml` → `scripts/check-prices.mjs`, que compara con el commit anterior vía git y notifica bajadas de precio a un webhook de Make.com (redes sociales).

El texto de "conciliación de CSV" que aparece en el editor es una idea abandonada — **se omite del plan** (decisión del usuario).

**Consolidación decidida:** una tabla `tariffs` en Postgres es el único camino real de edición.

## 4. Esquema de datos (Postgres)

- `profiles` — id (FK a auth), email, display_name, favorites, last_login, created_at, last_update
  - *(alternativa a valorar en implementación: normalizar `favorites` a tabla `favorites(user_id, tariff_id)` en vez de array, para poder consultarlo mejor)*
- `user_consumption_settings` — user_id FK, power_p1, power_p2, energy_p1..3, days, current_bill_total, current_price_p1..3 (reemplaza la subcolección `settings/consumption`)
- `bill_inputs` — id, user_id FK, created_at, name, best_tariff, best_company, potential_savings, is_ai_generated, invoice_file_url, invoice_file_path, invoice_file_type + campos de input (reemplaza `billInputs`)
- `admin_roles` — user_id PK (reemplaza `roles_admin`)
- `notifications` — id, title, message, type, link, created_at, is_global, target_user, data jsonb
- `notification_reads` / `notification_hides` — (notification_id, user_id) — sustituyen los arrays `readBy`/`hiddenBy` por tablas normales
- `contacts` — id, name, email, subject, message, created_at, status
- `tariffs` — company, name, type, p1_kw_day, p2_kw_day, e1_kwh, e2_kwh, e3_kwh, sus variantes `_with_taxes`, surplus_kwh, permanence, url, logo_url, updated_at, unique(company, name)

**Se elimina** (ya no aporta nada con tarifas en tabla real): `system_state/tariffs_snapshot` y la lógica de diff manual en `admin/dashboard/page.tsx` — existía solo porque no había otra forma de detectar cambios en un JSON estático en runtime; con `updated_at` real sobra.

## 5. Fases de ejecución

**Fase 0 — Infra y esquema**
Levantar Postgres en Coolify. Crear el esquema de la sección 4 (migraciones con Prisma/Drizzle). RLS/constraints según el intent de las reglas de Firestore actuales.

**Fase 1 — Auth**
- Auth.js v5: credentials (email/password) + Google OAuth.
- Middleware de sesión server-side, sustituyendo el chequeo 100% cliente actual.
- `AdminGuard` y rutas `admin/*` pasan a verificar sesión + `admin_roles` en servidor — se elimina la `ADMIN_API_KEY` estática.
- Migración de usuarios: Firebase no exporta el hash de password (scrypt vs lo que use Auth.js), así que no hay migración silenciosa. Con el volumen de usuarios actual, la vía simple es: exportar emails desde Firebase, crear cuentas, y enviar email de "restablece tu contraseña" en el corte. *(A confirmar en la sesión de implementación si se prefiere un puente de verificación en primer login en vez de esto.)*

**Fase 2 — Tarifas (nuevo, añadido a partir del hallazgo de la sección 3)**
- Crear tabla `tariffs`, seed único desde `data.json` actual.
- `useTariffs.ts`: pasa de import estático a leer de Postgres (route handler + revalidación), manteniendo la misma interfaz del hook para no tocar sus consumidores.
- `tarifas/page.tsx`: sus `addDoc/updateDoc/deleteDoc` pasan a Postgres — arregla el editor, hoy inoperante. Se quita el texto de "conciliación de CSV".
- Eliminar `src/app/api/admin/tariffs/route.ts` (código muerto).
- Sustituir `scripts/check-prices.mjs` + el workflow de git-diff por lógica de "si el precio nuevo es menor, avisa a Make.com" directamente en el guardado del admin.
- `data.json` se retira del runtime (queda como fixture de seed, o se borra tras confirmar la migración).

**Fase 3 — Resto de datos de usuario**
Script puntual con Firebase Admin SDK (se añade solo para el volcado, hoy no existe en el proyecto) que lee cada colección restante (`users`, `notifications`, `contacts`) y la inserta en Postgres. Ventana corta de solo-lectura en Firestore durante el volcado.

**Fase 4 — Código**
Sustituir `src/lib/firebase.ts` por cliente Postgres/ORM. Reescribir: `useFavorites.ts`, `mi-cuenta/page.tsx`, `ComparadorMain.tsx`, `notifications.ts` + sus 3 consumidores (campana, página, admin), `contacto/actions.ts`. Cada `onSnapshot` se convierte en polling/revalidate — no es crítico tener push en tiempo real en un comparador informativo de bajo tráfico.

**Fase 5 — Verificación y cierre**
QA manual de cada flujo (login/registro, favoritos, mi-cuenta, comparador, notificaciones, admin de tarifas, contacto). Quitar variables `NEXT_PUBLIC_FIREBASE_*` y el CSP vestigial de `*.firebaseio.com`. Mantener el proyecto Firebase pausado (no borrado) unas semanas como red de seguridad antes de decomisionarlo.

## 6. Decisiones tomadas

- Stack: Postgres + Auth.js + ORM (Prisma o Drizzle a decidir), self-hosted en Coolify. No BaaS.
- Tarifas entran en el alcance de la migración: tabla real en Postgres, un solo camino de edición.
- Conciliación por CSV: omitida por ahora.

## 7. Abierto para la sesión de implementación

- Prisma vs Drizzle.
- Estrategia exacta de migración de passwords (reset masivo vs puente de verificación en primer login).
- Si normalizar `favorites` a tabla propia o mantener array.
