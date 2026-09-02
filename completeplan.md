# Quantify Terminal Account Architecture — Complete Implementation Plan

**Canonical working plan**  
**Last updated:** 2026-09-02  
**Current source task:** Task 7 — user security settings and verified account changes  
**Production status:** **NO-GO / locked**  
**Staging status:** **Not yet evidenced**  

This file is the durable cross-repository resume point for the Quantify Terminal account architecture. Update it whenever a task changes state, receives an independent review, is committed, or gains new evidence. It records source progress only unless a section explicitly identifies authorized staging evidence.

## 1. Repositories and deployment targets

| Area | Local repository | Intended deployment |
| --- | --- | --- |
| Desktop | `/Users/aaryansaroha/Documents/Projects/Quantify Terminal` | Quantify Terminal desktop application |
| Account portal | `/Users/aaryansaroha/Documents/Projects/Quantify Terminal Account Portal` | Vercel / `https://account.quantifyterminal.com` |
| Main website | `/Users/aaryansaroha/Documents/Projects/Quantify Terminal Website` | Existing public marketing website |

The repositories are separate Git histories. Cross-repository work must use separate focused reviews and commits. Never use blanket staging in the dirty desktop worktree.

## 2. Product goal

Move complete user account management and all Owner/Admin/Support administration to a secure web portal. Keep the desktop focused on Quantify Terminal functionality, local system controls, basic cloud-synchronized user settings, optional device-local PIN protection, normal update checking, and a secure link to the complete web account.

A website-created, email-confirmed Supabase account must ultimately work in the desktop with the same credentials and immutable Supabase Auth UUID.

## 3. Non-negotiable safety boundary

1. Preserve all existing user data.
2. Supabase Auth UUID is the immutable identity. Never bind identity, roles, or ownership by email, editable metadata, local flags, or desktop labels.
3. The portal must never collect, transmit, store, display, log, or analyze a desktop PIN or PIN hash.
4. The desktop PIN is optional, device-local, and ultimately stored using platform-backed secure storage.
5. Administration is web-only after verified portal parity.
6. The browser and desktop must never receive a Supabase service-role key, Azure storage credential, SMTP credential, signing key, provider secret, raw privileged token, or another server secret.
7. Passwords, access/refresh tokens, PINs, handoff codes, and secrets must not enter URLs, logs, DTOs, analytics, or API responses.
8. Do not inspect real `.env` values or use live users.
9. Do not mutate Supabase, Azure, Vercel, DNS, SMTP, production settings, production data, or live Auth settings during source tasks.
10. Source migrations and tests may be authored, but no migration may be applied to a cloud project without authorized staging evidence.
11. Keep `stagingReady=false` and `productionReady=false` until Task 19 evidence and approval.
12. Preserve the Vercel production-build lock and strict preflight failure.
13. Stage named files only. Never include unrelated desktop work.
14. Every task follows: focused implementation → focused tests → full validation → independent semantic `APPROVED` → focused commit → ordinary Git push.
15. Production or other high-risk mutations require a fresh explanation, backup/rollback evidence, and explicit human go/no-go at that time.

## 4. Architecture authority

- **Identity/password authority:** Supabase Auth.
- **Immutable key:** `auth.users.id` UUID.
- **Shared profile/preferences authority:** `public.app_profiles`.
- **Access/service-profile authority:** `public.app_user_profiles`.
- **Canonical role authority:** server-managed `public.app_roles` with Owner, Admin, Support, and User.
- **Self-service authorization:** Supabase RLS and owner-bound RPCs.
- **Privileged/cross-user authorization:** versioned Azure Account API with independent capability enforcement.
- **Portal auth:** Next.js App Router, `@supabase/ssr`, HttpOnly cookies, same-origin Server Actions/BFF.
- **Desktop database:** local cache only; never canonical identity or authorization.
- **Unified sessions:** `account_sessions` and append-only `auth_events`, without raw tokens.
- **Desktop-to-browser handoff:** server-generated random opaque code, hash-only storage, about 60 seconds, UUID/session binding, one use, rate limits, audit, clean post-exchange redirect.
- **Secrets:** Azure Key Vault or managed provider configuration; never returned to clients.

## 5. Route map

### Public portal routes

- `/login`
- `/signup`
- `/verify-email`
- `/auth/confirm`
- `/forgot-password`
- `/reset-password`
- `/auth/error`

### User portal routes

- `/account`
- `/account/profile`
- `/account/preferences`
- `/account/security`
- `/account/sessions`
- `/account/activity`
- `/account/data`
- `/account/notifications`

### Administrative portal routes

- `/admin`
- `/admin/users`
- `/admin/users/[userId]`
- `/admin/sessions`
- `/admin/audit`
- `/admin/notifications`
- `/admin/email`
- `/admin/reports`
- `/admin/configuration`
- `/admin/credentials`
- `/admin/releases`

## 6. Desktop end state

The visible **Account** tab becomes **System**. Keep the internal `account` identifier temporarily for layouts, command search, and access-profile compatibility until stored values are migrated.

System contains only:

1. Account summary: name, verified email, account/subscription status, cloud sync state, and read-only role where appropriate. No user image is stored or displayed.
2. General preferences: timezone, currency, theme/display, refresh preferences, and user notification preferences synchronized with `app_profiles`.
3. Device security: optional local six-digit PIN create/change/remove, device-only explanation, nonblocking recommendation, and cloud-password reauthentication for forgotten-PIN reset.
4. Local controls: installed version, update checking, appropriate diagnostics, and sign out.
5. **Manage Account Online**: secure one-time handoff when available, normal portal login fallback.

After verified web parity, remove the desktop Admin Control Center, user directory, global email tools, notification authoring, role/credential/report/release administration, and unreachable admin code. Retain the normal end-user update checker.

## 7. Current status dashboard

| Task | State | Evidence / next action |
| --- | --- | --- |
| 1 | ✅ Source complete | Portal foundation and themed shell in initial portal commit history. |
| 2 | ✅ Offline/source baseline complete | Non-secret integrated preflight exists; live environment remains unverified. |
| 3 | ✅ Source complete | Supabase SSR login/logout, protected route, DAL/DTO, safe redirects. |
| 4 | ✅ Source complete and independently approved | Review: `Quantify Terminal/semantic-review/2026-09-02-105710-pr-4.md`. Eight migration source contract exists. No cloud/PostgreSQL claim. |
| 5 | ✅ Source complete, independently approved, committed, pushed | Review: `Quantify Terminal Account Portal/semantic-review/2026-09-02-125249-pr-local.md`. Portal commit `4908e06de0d36757488b542ea66328f88f8b79a3`; `origin/main` matched after push. |
| 6 | ✅ Source complete, independently approved | Profile/preferences versioned CAS contract. Photo feature removed by decision: the product stores no user images. Reviews: `Quantify Terminal/semantic-review/2026-09-02-task-6-photo-removal-desktop-followup.md`, `Quantify Terminal Account Portal/semantic-review/2026-09-02-task-6-photo-removal-portal-final.md`. No cloud/PostgreSQL claim. |
| 7 | ⏳ Next | Begin now that Task 6 is approved and published. |
| 8 | ⏳ Not started | Azure Account API/RBAC source and staging IaC. |
| 9 | ⏳ Not started | Role-aware shell and AAL2. |
| 10 | ⏳ Not started | Unified web sessions/events. |
| 11 | ⏳ Not started | Desktop signup/UUID/session/local-PIN migration. |
| 12 | ⏳ Not started | Cloud-authoritative admin dashboard. |
| 13 | ⏳ Not started | Full role-controlled user administration. |
| 14 | ⏳ Not started | Notifications and administrative email. |
| 15 | ⏳ Not started | Owner configuration/credentials/releases. |
| 16 | ⏳ Not started | Immutable audit exploration and reports. |
| 17 | ⏳ Not started | Export and controlled deletion. |
| 18 | ⏳ Not started | Integrated security/privacy/accessibility/reliability validation. |
| 19 | ⛔ Blocked | Production rollout requires complete staging evidence and explicit go/no-go. |

## 8. Completed-task evidence

### Task 1 — Portal foundation and themed shell — COMPLETE

**Objective:** Establish a secure, maintainable Next.js/TypeScript baseline matching Quantify Terminal’s visual language.

**Completed source:** pinned dependencies, strict TypeScript, lint/format/test/build tooling, environment validation, `.env` exclusions, Vitest/Testing Library/Playwright, responsive and accessible auth shell, near-black/amber/square-edge tokens, Space Grotesk integration, security-header foundation, CI, and deployment lock.

**Remaining environment evidence:** none claimed; this was a source foundation task.

### Task 2 — Safe cloud baseline and staging preflight — COMPLETE AS OFFLINE SOURCE BASELINE

**Objective:** inventory contracts without changing production.

**Completed source:** non-secret integrated preflight, explicit checked-in paths, exact migration allow-list, environment-name presence checks, redacted output, Azure/marketing/desktop contract checks, strict production-readiness failure, and staging/production readiness booleans locked false.

**Still unknown:** live schema, Auth settings, Supabase project parity, Vercel linkage, DNS, SMTP, Azure deployment, Key Vault, and staging resources.

### Task 3 — SSR login/logout and protected existing-user routing — COMPLETE

**Objective:** securely authenticate existing verified users.

**Completed source:** `@supabase/ssr` client/cookie policy, session refresh proxy, safe redirect policy, Server Action login/logout, protected account route, UUID-scoped server DAL, allow-listed account DTO, private/no-store route headers, and local-scope logout.

### Task 4 — Versioned Supabase identity compatibility — COMPLETE IN SOURCE

**Objective:** define immutable UUID identity, canonical roles, profile provisioning, sessions/events, and strong grants/RLS.

**Completed source:** eight ordered migrations, clean baseline/adoption preflight, immutable UUID ownership, canonical Owner/Admin/Support/User roles, ordinary-user provisioning, session/event tables, grants/RLS hardening, contract validation, drift fixtures, migration validator, upgrade harness, and runbook.

**Independent review:** `APPROVED` at:

`/Users/aaryansaroha/Documents/Projects/Quantify Terminal/semantic-review/2026-09-02-105710-pr-4.md`

**Boundary:** migrations have not been applied to managed Supabase. PostgreSQL/pgTAP and staging execution remain later evidence. The desktop repository currently contains extensive unrelated dirty work; all migration publication must stage exact files only.

### Task 5 — Signup, confirmation, recovery — COMPLETE IN SOURCE

**Objective:** make website registration the public account-creation flow.

**Completed source:** signup validation, consent metadata, Supabase-managed Turnstile token forwarding, code-only PKCE confirmation, trusted runtime `redirectType` binding, mismatch session cleanup, generic duplicate/recovery behavior, password reset, local-scope session cleanup, strict CSP/no-store, and structural preflight.

**Recovery guard limitation:** the five-minute HttpOnly marker is an ordinary browser-flow guard tied to UUID/access token. It is not a malicious bearer-token defense or globally atomic one-time store; that limitation is documented.

**Independent review:** `APPROVED` at:

`/Users/aaryansaroha/Documents/Projects/Quantify Terminal Account Portal/semantic-review/2026-09-02-125249-pr-local.md`

**Published commit:** `4908e06de0d36757488b542ea66328f88f8b79a3` (`Implement secure web account lifecycle`).

**Validation at completion:** formatting/lint/typecheck/build, 114 Vitest tests, 14 Playwright tests, integrated preflight 18 pass / 9 expected warnings / 0 blocked; `stagingReady=false`, `productionReady=false`; production build and strict preflight failed closed as intended.

## 9. Task 6 execution record — COMPLETE IN SOURCE

### Scope decision: no user images

The profile photo feature was **removed from Task 6 entirely** at the user's direction. The product stores no user images: no Supabase Storage bucket, no object policies, no upload path, no image processing, no image proxy, and therefore no orphaned-object lifecycle to reclaim. Task 6 is now exactly the versioned profile and preferences contract.

The pre-existing legacy `app_profiles.profile_photo_path` column is untouched user data owned by the desktop application and its retained 13-argument v1 RPC. No migration and no portal code path reads, writes, drops, alters, clears, or normalizes it, and the preservation suite proves an existing nonconforming legacy value survives byte-for-value.

### Objective

Let authenticated users safely view and edit their shared account profile and preferences under immutable UUID ownership, with optimistic concurrency that cannot silently overwrite another session's write.

### Delivered fields

- First/last name, phone, country
- Timezone and default currency
- Price-alert, portfolio-move, and news-digest preferences
- Optimistic profile version and updated timestamp

### Database/source contract as built

1. Tasks 1–4 migrations remain immutable; Task 6 appended only new files. The ledger is **11 ordered migrations**.
2. `20260902000700_profile_contract_preflight.sql` is a read-only, fail-closed post-`00600` gate.
3. `20260902000900_versioned_profile_rpc.sql` adds positive `profile_version bigint`, its CHECK, an overflow-safe every-UPDATE increment trigger, and `update_my_app_profile_v2` with 13 inputs, 12 defaults, `SECURITY DEFINER`, empty search path, identity from `auth.uid()`, active-account enforcement, per-field validation, and compare-and-swap on the expected version.
4. The v2 receipt is exactly three columns: `user_id`, `profile_version`, `updated_at`. It has no photo argument and no photo field.
5. `20260902001000_profile_contract_validation.sql` is the final fail-closed catalog gate; its only executable mutation is a `COMMENT`.
6. The exact 13-argument v1 RPC remains callable with its OID and authenticated-only EXECUTE ACL. Task 11 must migrate desktop writers before it can be revoked.
7. Stale writes fail with SQLSTATE `40001`; invalid input fails with `22023`; bigint exhaustion fails with `22003` and changes no row.
8. The offline validator rejects any reintroduced Storage reference in any migration, pgTAP suite, or harness fixture, and rejects any Task 6 attempt to create, replace, or drop the legacy v1 RPC.
9. No migration was applied to any cloud project during this task.

### Portal behavior as built

1. Protected account navigation with `/account/profile` and `/account/preferences`.
2. Explicit-column, Auth-verified, UUID-owner-checked DAL reads; no `select *`.
3. Fresh allow-listed DTOs only; the legacy photo column is never selected or projected.
4. Server Actions call only the authenticated v2 RPC. The portal issues no direct insert, update, upsert, or delete against `app_profiles`.
5. Exact RPC envelope classification: success only when `error === null` with one strict three-field receipt whose owner UUID and `expectedVersion + 1` match; definitive stale only when `data === null` and `error.code` is the string `"40001"`. A missing or undefined `error`, a mixed data-plus-error pair, a numeric `40001`, a malformed receipt, and a thrown call are service failures.
6. A stale result returns the committed version and revalidates every cached account read, so the visitor can retry without a manual reload.
7. Unauthenticated Auth is the only condition that yields `null` and therefore the only condition that redirects to `/login`. Provider errors, absent rows, malformed or cross-owner DTOs, transport throws, unusable identities, and server-client factory failures raise generic server-only errors rendered by a root and a segment error boundary, with no provider detail exposed.
8. Source integrity is pinned: `supabase.migration-integrity` compares exact SHA-256 digests of the raw bytes of all 11 desktop migrations, and the collector enumerates the migrations directory so an unpinned extra file blocks instead of hiding.
9. No dependency on `sharp` and no Storage client usage anywhere.

### Independent reviews — both `APPROVED`

- Desktop: `/Users/aaryansaroha/Documents/Projects/Quantify Terminal/semantic-review/2026-09-02-task-6-photo-removal-desktop-followup.md`
- Portal: `/Users/aaryansaroha/Documents/Projects/Quantify Terminal Account Portal/semantic-review/2026-09-02-task-6-photo-removal-portal-final.md`

Both reviewers probed the gates by executing them, including mutated temporary copies proving the Storage bans, the digest pins, the v1 protections, and the envelope classifier all fail closed.

### Validation at completion

Desktop, offline only:

- `scripts/validate_supabase_migrations.py --json` → `{"valid": true, "migrationCount": 11, "errors": []}`
- focused pytest → 48 passed
- Python AST parse and scoped `git diff --check` → clean
- upgrade harness → fails closed before any SQL with `initdb is unavailable; install reviewed PostgreSQL 15 + pgTAP locally`, exit 1
- protected `00000`–`00600` SHA-256 values unchanged
- scenario inventory 16 total: 2 success paths, 14 negative (12 Task 4, 2 Task 6); pgTAP plans 20/20/35/30 plus preservation 27

Portal:

- `npm run validate` → formatting, lint, typecheck, 39 Vitest files / 286 tests, Next build, preflight **20 pass / 9 expected warnings / 0 blocked**
- `npm run test:e2e` → 14 Playwright tests
- `sourceReady=true`, `stagingReady=false`, `productionReady=false`
- `VERCEL_ENV=production npm run build` → exit 1 with the exact production lock error
- `npm run preflight:strict` → exit 1
- `git diff --check` clean; `next-env.d.ts`, `package.json`, and `package-lock.json` unmodified

### Boundary that remains after Task 6

PostgreSQL 15 and pgTAP are unavailable locally, so **no SQL runtime evidence exists**: the 11 migrations, 4 pgTAP suites, and 16 harness scenarios are unexecuted. Managed staging remains mandatory for provider catalog capture, both read-only preflights, ordered mutations, strict TAP, and portal/desktop interoperability. The two authenticated account routes ship without an end-to-end accessibility scan or a live save. **Production remains NO-GO.**


## 10. Remaining task definitions

### Task 7 — User security settings and verified account changes

Implement current-password reauthentication, password change, secure verified email change, TOTP enrollment/challenge/unenrollment, recovery guidance, and security notifications. Derive MFA state from verified Supabase factors, not `two_factor_enabled`. Test password policy, old/new email confirmation, expiry, AAL changes, failed challenges, factor removal, and session behavior.

### Task 8 — Versioned Azure Account API and canonical RBAC

Create a separate modular Azure Function package and staging IaC. Implement bearer validation, active checks, correlation IDs, typed errors, request limits, DTO allow-lists, idempotency, audit hooks, and reviewed Owner/Admin/Support/User capabilities. Dual-read legacy blob and database roles, report mismatches, and cut over only in staging after evidence. Keep reviewed UUIDs as break-glass Owners only.

### Task 9 — Role-aware portal shell and privileged MFA

Build portal administration navigation from backend-returned capabilities. Independently authorize routes, handlers, and actions. Require AAL2 for Owner/Admin/Support and recent reauthentication for sensitive Owner operations. Test direct-URL/action bypass, stale roles, missing AAL2, recent-auth expiry, and role-specific navigation.

### Task 10 — Unified web sessions and security events

Register/resume/heartbeat/end/list/revoke cloud sessions using the Supabase `session_id` claim and append-only events. Minimize device/network metadata and store no raw tokens. Test ownership, multiple browsers, heartbeat expiry, scoped/global logout, replay, revoked-session denial, retention, and redaction.

### Task 11 — Desktop portal signup, UUID identity, cloud sessions, and local-only PIN

Replace embedded desktop signup/recovery with portal links. Persist and migrate immutable cloud UUID, ensure verified email changes update the same local user, stop reusable cloud-password verifier storage, integrate cloud sessions/revocation, move PIN verifier to OS SecureStore, eliminate all `app_passcode_hash` cloud reads/writes, preserve on-device PINs, and add a nonblocking once-per-launch recommendation. This is the desktop migration; it is **not** Task 6.

### Task 12 — Cloud-authoritative admin dashboard

Create truthful global metrics for accounts, statuses, registration/verification, sessions, login/security trends, and platform distribution. Use server timestamps, bounded ranges, pagination, privacy-minimized location, and explicit freshness. Test timezone boundaries, duplicates, stale sessions, role filtering, large/empty data, pagination, and consistency.

### Task 13 — Full role-controlled user administration

Implement paginated directory/detail, Support-redacted DTOs, invites, verification/reset links, suspend/reactivate, session revoke, subscription/access/service profiles, roles, and per-target bulk outcomes. Replace temporary passwords with links. Enforce last-Owner and self-action protections with audit correlation.

### Task 14 — Notifications and administrative email

Implement notification targeting, scheduling, expiry, revisions, pause/resume, duplication, and receipts. Use queued sanitized Azure email jobs with quotas, idempotency, retry/outcomes, and cross-device history. Deny unsafe scripts/links and unauthorized Support use.

### Task 15 — Owner-only configuration, credentials, and releases

Show masked/status-only credential information. Accept write-only rotation through Azure/Key Vault and never return values. Require HTTPS release URLs, checksums, server signature validation, idempotency, revision control, audit, rollback, and publish-before-email ordering.

### Task 16 — Immutable audit exploration and safe reports

Expand append-only events with actor/subject/effective role/result/request ID/safe summaries. Prevent ordinary update/delete. Add role-aware filters, queued reports, formula-safe CSV, and private expiring downloads. Test immutability, denied-action records, redaction, scope, filter accuracy, CSV escaping, expiry, and retries.

### Task 17 — Account export and controlled deletion

Implement export/deletion state machines. Create complete private encrypted exports with short-lived downloads. Require reauthentication, typed confirmation, notifications, 14-day cooling-off, cancellation, legal holds, session revocation, retry/compensation, Storage/Azure/Auth cleanup, and minimized audit tombstone. Do not promise immediate remote deletion of offline desktop caches.

### Task 18 — Integrated security, privacy, accessibility, and reliability validation

Validate CSP/HSTS/anti-framing/referrer/permissions/no-store/same-origin/CSRF/rate limits/scanning/redacted logs/alerts/backups/recovery/dead letters. Keep account pages analytics-free unless separately approved. Run portal, Azure, desktop, pgTAP, Playwright browser, axe, visual, abuse/load, dependency, and baseline security suites. Produce staging release-candidate evidence only.

### Task 19 — Controlled production rollout — EXPLICITLY BLOCKED

Only after all staging evidence and a separate explicit human go/no-go:

1. Complete backup and migration/rollback rehearsals.
2. Apply additive database migrations.
3. Deploy Azure Account APIs/workers.
4. Deploy portal.
5. Release desktop compatibility update.
6. Configure Supabase Site URL/redirects, SMTP, Vercel, DNS/TLS, Key Vault, monitoring, and backups.
7. Add main website Account links.
8. Validate existing users, new signup-to-desktop, every role, revocation, export/deletion, deliverability, alerts, and smoke tests.
9. Enforce minimum secure desktop adoption only after evidence.
10. Scrub legacy cloud PIN metadata only after old writers are blocked.
11. Cut over canonical role authority with backup and rollback.

No production action in this list is authorized merely by this plan file.

## 11. Critical acceptance tests

- A website-created confirmed user can use the same account in desktop during authorized staging.
- No portal request, form, row, log, DTO, response, or analytics event contains PIN data.
- Account visibly becomes System without breaking desktop stored identifiers.
- Preferences synchronize portal/Supabase/desktop.
- Manage Account Online uses one-time handoff; reuse/expiry fails and another browser account is not silently overwritten.
- Desktop has no administration after verified web parity.
- User/Support/Admin/Owner capabilities are independently server-enforced.
- Portal shows/revokes web and desktop sessions.
- Existing users and local PINs survive migration.
- Passwords, PINs, privileged keys, provider secrets, and email credentials do not enter client artifacts/logs/responses.
- Export/deletion are auditable and retry-safe.
- Portal is responsive, keyboard accessible, WCAG-oriented, and visually consistent.
- Production stays locked until monitoring, backups, rehearsals, staged evidence, and explicit go/no-go.

## 12. Validation commands and release evidence

### Portal

```bash
npm run validate
npm run test:e2e
VERCEL_ENV=production npm run build   # must fail until Task 19
npm run preflight:strict              # must fail until Task 19
git diff --check
```

### Desktop migration source

Use focused pytest and migration validators documented in the desktop runbook. Do not run cloud migration commands. The Task 4 local SQL harness and pgTAP evidence must remain isolated from managed projects.

### Review policy

- Independent semantic review must end in `APPROVED`.
- Any `BLOCKED` or `NEEDS_CHANGES` finding must be fixed and re-reviewed.
- Validation success is not staging evidence.
- Record review paths, commit SHAs, push status, counts, and expected fail-closed gates here after every task.

## 13. Resume protocol

When resuming work:

1. Read this file first.
2. Check all three repository worktrees and current branches.
3. Read the latest approved semantic reviews.
4. Resume the current task and immediate next steps, not a later task.
5. Never overwrite unrelated desktop changes.
6. Keep source/staging/production claims distinct.
7. Update this file before ending a substantial work session.
8. Stop and request explicit approval before any cloud/data/production mutation or Task 19 action.
