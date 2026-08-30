# Sempre One WhatsApp Operator Integration

_Last updated: August 24, 2026_

## Purpose

Luxivie exposes a private, server-to-server API that allows an explicitly approved Sempre One platform operator to manage Luxivie blog drafts through WhatsApp.

The integration supports:

- listing and reading Luxivie posts;
- creating bounded blog drafts;
- editing title, excerpt, content, and schedule fields;
- scheduling drafts with optimistic version checks;
- compact post analytics;
- post preview URLs;
- short-lived editor handoff URLs;
- health checks for deployment validation.

WhatsApp does not write directly to Luxivie's Supabase tables. `client-cms` authorizes the WhatsApp operator and calls Luxivie's private API. Luxivie validates the service request and uses its existing blog services and canonical Supabase-backed store.

## Implemented changes

### Luxivie application

- Added HMAC-SHA256 JWT verification with issuer, audience, website subject, action, timestamp, signature, and nonce validation.
- Added private operator routes for health, post list/detail, draft creation/editing, scheduling, preview, editor handoff, and analytics.
- Added bounded operator DTO mapping instead of returning raw Supabase rows.
- Added mutation idempotency and optimistic version-conflict responses.
- Added short-lived signed editor handoffs and admin-cookie redirection.
- Added operator environment variables to `.env.example`.

### `client-cms`

- Added the Luxivie content adapter and exact website-ID adapter resolution.
- Added approved operator identity, website-specific grant, workspace, provisioning command, and local test seeder flows.
- Added post list, create, edit, schedule, and analytics WhatsApp actions.
- Added paginated post selection with opaque operator/workspace/site/post tokens and typed title matching.
- Added natural-language schedule parsing, contextual Confirm/Cancel controls, version checks, and neutral error messages.
- Added transient retries that use fresh authentication material while preserving mutation idempotency keys.
- Added the Luxivie kill switch, audit correlation, local smoke checklist, and automated integration coverage.

## Architecture

```text
WhatsApp user
  -> Meta webhook
  -> client-cms WhatsApp principal resolver
  -> approved PlatformOperatorWhatsAppIdentity
  -> active website-specific PlatformOperatorSiteGrant
  -> LuxiviePostsAdapter
  -> signed HTTPS request
  -> Luxivie /api/internal/operator/*
  -> operator authentication and validation
  -> Luxivie blog service
  -> Supabase blogs table
```

Tenant membership and platform-operator access are separate:

```text
Tenant access:
WhatsAppIdentity -> client/website membership

Luxivie operator access:
PlatformOperatorWhatsAppIdentity -> PlatformOperator -> PlatformOperatorSiteGrant
```

A normal Sempre One business code can create a tenant connection. It does not grant platform-operator access. The WhatsApp number must also have an approved platform-operator identity and an active grant for the exact Luxivie website.

## Ownership boundaries

### `client-cms` owns

- WhatsApp webhook processing and outbound messages;
- tenant versus platform-operator principal resolution;
- operator identity approval;
- website-specific grants and capabilities;
- selected-site conversation context;
- WhatsApp menus and bounded confirmation flows;
- retries, idempotency keys, audit correlation, and user-facing failure messages;
- the internal kill switch.

### Luxivie owns

- service-token validation;
- exact website-subject validation;
- nonce replay rejection;
- request-field validation;
- canonical blog reads and mutations;
- optimistic version checks;
- API-level idempotency outcomes;
- preview and editor handoff URLs;
- Supabase connectivity and blog environment health.

## Environment configuration

Never commit real service secrets. Generate a high-entropy shared value and configure the same value in both applications.

### Luxivie `.env.local`

```dotenv
SEMPRE_OPERATOR_SERVICE_SECRET=<shared-high-entropy-secret>
LUXIVIE_OPERATOR_WEBSITE_ID=<exact-client-cms-website-id>
NEXT_PUBLIC_SITE_URL=http://localhost:3000

ADMIN_PASSWORD_HASH=<bcrypt-admin-password-hash>
ADMIN_SESSION_SECRET=<independent-admin-session-secret>
```

The operator service secret and admin session secret must be independent values.

Luxivie's normal Supabase variables must also be configured for the existing blog service. See the project's root environment setup for the current variable names.

### `client-cms` `.env`

```dotenv
LUXIVIE_OPERATOR_BASE_URL=http://localhost:3000
SEMPRE_OPERATOR_SERVICE_SECRET=<same-shared-high-entropy-secret>
LUXIVIE_OPERATOR_WEBSITE_ID=<same-exact-website-id>
LUXIVIE_CLIENT_SLUGS=luxivie,luxivie-pilot
LUXIVIE_OPERATOR_KILL_SWITCH=false
LUXIVIE_TIMEZONE=America/Toronto
```

`LUXIVIE_OPERATOR_BASE_URL` must be reachable from the PHP process and queue worker, not only from a browser.

`LUXIVIE_OPERATOR_WEBSITE_ID` must match the actual Luxivie `Website.id` in `client-cms`. Luxivie compares this value with the JWT `sub` claim and rejects mismatches.

## Service authentication

Every private operator route calls `assertOperatorServiceRequest()` from `lib/operator-auth.ts`.

The bearer token is an HMAC-SHA256 JWT with these claims:

| Claim | Meaning |
| --- | --- |
| `iss` | Must be `client-cms`. |
| `aud` | Must be `luxivie`. |
| `sub` | Exact `client-cms` Luxivie website ID. |
| `iat` | Token issue time. |
| `exp` | Expiry, no more than five minutes after issue. |
| `jti` | One-time nonce. |
| `correlation_id` | Request-attempt correlation ID. |
| `action` | Exact allowlisted action required by the endpoint. |

The request also includes:

```http
Authorization: Bearer <jwt>
X-Nonce: <one-time-nonce>
X-Correlation-Id: <attempt-correlation-id>
X-Operation-Id: <business-operation-id>
Accept: application/json
```

The action claim is endpoint-specific. A valid token for listing posts cannot be reused to create or edit a post.

### Replay protection and retries

Luxivie rejects a reused JWT nonce. `client-cms` therefore creates a new JWT, nonce, and correlation ID for every HTTP attempt.

The same business-level `idempotency_key` remains in the request body across retries. This prevents a retry from creating or applying a mutation twice.

`client-cms` retries only:

- connection failures and timeouts;
- HTTP 429;
- HTTP 5xx.

It does not retry HTTP 400, 401, 403, or 409.

## Internal operator API

All routes are private server-to-server endpoints beneath `/api/internal/operator`.

| Method | Route | Required action | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | `luxivie.health.read` | Service health and deployment reachability. |
| `GET` | `/posts` | `luxivie.posts.list` | List bounded operator post DTOs. |
| `GET` | `/posts/{id}` | `luxivie.posts.detail` | Read one post and its current version. |
| `POST` | `/posts/drafts` | `luxivie.posts.create_draft` | Create one draft using an idempotency key. |
| `PATCH` | `/posts/{id}/draft` | `luxivie.posts.edit_draft` | Edit allowed draft fields using an expected version. |
| `POST` | `/posts/{id}/schedule` | `luxivie.posts.schedule` | Schedule a post using an expected version. |
| `GET` | `/posts/{id}/preview` | `luxivie.posts.preview` | Return a preview URL. |
| `POST` | `/posts/{id}/editor-handoff` | `luxivie.posts.open_editor` | Return a signed editor handoff URL. |
| `GET` | `/analytics/posts` | `luxivie.posts.analytics` | Return compact post analytics. |

Implementation locations:

- `app/api/internal/operator/**/route.ts`
- `lib/operator-auth.ts`
- `lib/operator-blogs.ts`

## Operator post DTO

The private API returns a bounded DTO rather than a raw Supabase row:

```ts
interface OperatorPost {
  id: string
  title: string
  excerpt: string | null
  content: string | null
  category: string | null
  tags: string[] | null
  status: 'draft' | 'scheduled' | 'published'
  scheduled_at: string | null
  published_at: string | null
  updated_at: string
  version: string
  preview_url: string | null
  editor_handoff: string | null
}
```

List responses omit full content. Detail responses include bounded content when required for an edit confirmation.

The current version token is derived from `updated_at`. Mutations must include the version that was read before the WhatsApp confirmation.

## Validation boundaries

Operator mutations are bounded to approved fields and lengths:

- title: required, maximum 120 characters;
- excerpt: maximum 300 characters;
- content: maximum 2,000 characters;
- schedule: an ISO timestamp is passed to Luxivie after `client-cms` parses and rejects unrecognized or past WhatsApp input;
- category and tags: accepted only through the typed operator service contract where supported;
- unknown or unsafe fields are not passed through as arbitrary database columns.

Media upload, permanent deletion, social-account configuration, rich visual review, and public publishing remain browser workflows.

## WhatsApp workflows

### View posts

1. The operator selects Luxivie.
2. `Posts` calls `GET /api/internal/operator/posts`.
3. WhatsApp shows five posts per summary page with friendly status and dates.
4. `View more posts` advances the read-only page.

### Create a draft

1. Collect title.
2. Collect optional short summary.
3. Collect bounded content.
4. Collect an optional natural-language schedule or save as draft.
5. Show an explicit Confirm/Cancel summary.
6. On confirmation, call `POST /posts/drafts` with a stable idempotency key.

No Luxivie record is created before confirmation.

### Edit a draft

1. Display a paginated post picker with up to eight post rows.
2. Select a post using an opaque, expiring action token, a visible page number, or a clear title match.
3. Read the latest detail and version.
4. Choose title, excerpt, content, or schedule.
5. Show the current and proposed values.
6. On confirmation, call `PATCH /posts/{id}/draft` with `expected_version` and `idempotency_key`.

Opaque post-selection tokens are scoped by operator identity, workspace, website, and post ID.

### Schedule a post

1. Select a post through the same paginated picker.
2. Enter a natural date such as `next Friday at 9 AM`.
3. `client-cms` normalizes the value in `LUXIVIE_TIMEZONE`.
4. Confirm the normalized date and timezone.
5. Call `POST /posts/{id}/schedule` with the expected version.

Past or unrecognized dates produce a friendly retry prompt and no mutation.

### Version conflicts

If a web administrator changes the post after WhatsApp reads it, Luxivie returns HTTP 409 with the current post DTO. `client-cms` reports a friendly conflict instead of overwriting the newer version.

### Transient failures

If a mutation encounters a temporary connection, rate-limit, or server failure:

- the same business idempotency key is retained;
- every request attempt receives fresh authentication material;
- the pending WhatsApp confirmation remains active;
- the user receives a neutral message with Confirm and Cancel controls;
- raw HTTP bodies, nonces, internal URLs, and secrets are not shown.

## Analytics

`Post analytics` calls `/api/internal/operator/analytics/posts` and returns a compact WhatsApp summary. The response should remain aggregate and must not expose visitor-level data or private customer records.

## Preview and editor handoff

`lib/operator-handoff.ts` creates an HMAC-signed, 15-minute handoff containing:

- blog slug;
- requested action;
- issue and expiry timestamps;
- random nonce.

The resulting URL targets:

```text
/api/operator-handoff?token=<signed-token>&action=edit
```

`app/api/operator-handoff/route.ts` verifies the handoff, creates the Luxivie admin cookie, and redirects to the selected blog editor or public preview.

Treat this route as privileged authentication infrastructure. Keep it HTTPS-only in production, protect the shared secret, and do not log the token or include it in WhatsApp audit text.

## Local bootstrap and testing

### Start Luxivie

```bash
cd luxivie
npm install
npm run dev
```

Default local URL:

```text
http://localhost:3000
```

### Start `client-cms`

```bash
cd client-cms
php artisan migrate
php artisan serve --port=8000
```

Run the queue worker separately when webhook processing is queued:

```bash
php artisan queue:work
```

### Seed local operator data

From `client-cms`:

```bash
php artisan db:seed --class=LuxivieWhatsAppTestSeeder
```

The seeder prints the exact Luxivie website ID. Copy that ID into both applications before testing.

The local business code and WhatsApp-number setup are documented in:

- `client-cms/docs/technical/whatsapp/luxivie-local-smoke-test.md`

The test number is configured at test or deployment time. It is not a permanent Luxivie application credential.

### Verification

From `luxivie`:

```bash
npx tsc --noEmit
```

From `client-cms`:

```bash
php artisan test --filter=LuxivieWhatsAppFlowTest
php artisan test --filter=PlatformOperatorPostDraftConversationTest
php artisan test --filter=WhatsApp
```

## Operational checklist

Before enabling the integration:

- [ ] Both applications use the same operator service secret.
- [ ] Both applications use the same exact Luxivie website ID.
- [ ] `LUXIVIE_OPERATOR_BASE_URL` is reachable from the PHP process and queue worker.
- [ ] Luxivie's Supabase/blog environment is healthy.
- [ ] `GET /api/internal/operator/health` accepts a correctly signed request.
- [ ] Operator migrations are applied in `client-cms`.
- [ ] The WhatsApp number has an approved platform-operator identity.
- [ ] The operator has an active, website-specific Luxivie grant.
- [ ] The Luxivie workspace is active with `site_profile`, `posts`, and `analytics`.
- [ ] The grant contains only approved post read/draft/schedule/analytics capabilities.
- [ ] `LUXIVIE_OPERATOR_KILL_SWITCH=false` only after health and isolation tests pass.
- [ ] Meta webhook, queue worker, access token, and outbound delivery are healthy.
- [ ] Unauthorized and missing-grant numbers have been tested.
- [ ] No logs or WhatsApp responses include service secrets or signed tokens.

## Failure behavior

| Condition | Expected WhatsApp behavior |
| --- | --- |
| No tenant/operator connection | Ask the user to connect with a business code. |
| Tenant connection but no Luxivie operator grant | Explain that Luxivie access has not been approved. |
| Expired or revoked grant | Clear selected-site context and require site selection again. |
| Luxivie unreachable | Explain that Luxivie is temporarily unavailable while preserving the WhatsApp connection. |
| HTTP 400/401/403 | Do not retry; return a neutral failure. |
| HTTP 409 | Report a version conflict and do not overwrite. |
| HTTP 429/5xx or connection failure | Retry with fresh JWT/nonce/correlation ID and the same idempotency key. |

## Security requirements

- Never expose `SEMPRE_OPERATOR_SERVICE_SECRET`, bearer tokens, nonces, signed handoff tokens, Supabase service keys, or admin session secrets in responses or logs.
- Never authorize from a client slug alone; require the exact website subject and server-owned grant.
- Never accept arbitrary model names, field names, or method names from WhatsApp.
- Never treat a tenant business-code connection as operator authorization.
- Never publish, permanently delete, change media, or modify social-account settings through the bounded WhatsApp draft flow.
- Keep all operator routes private and authenticated.
- Recheck grants and versions at execution time, not only when rendering a WhatsApp menu.

## Current implementation notes

The current nonce replay store and operator idempotency store in Luxivie are process-local in-memory maps. They protect a single running process but are not durable across restarts and are not shared across multiple application instances. Before horizontally scaling the operator API, move replay and idempotency records to a shared durable store such as Redis or a database with uniqueness constraints and TTL cleanup.

The editor handoff currently converts a valid signed handoff into a Luxivie admin session cookie. Any production hardening of admin re-authentication should be applied in `app/api/operator-handoff/route.ts` without weakening token expiry, signature verification, or destination binding.

## Key files

### Luxivie

- `lib/operator-auth.ts`
- `lib/operator-blogs.ts`
- `lib/operator-handoff.ts`
- `lib/admin-auth.ts`
- `app/api/internal/operator/**/route.ts`
- `app/api/operator-handoff/route.ts`
- `.env.example`

### `client-cms`

- `app/Services/WhatsApp/Platform/Content/SiteContentAdapter.php`
- `app/Services/WhatsApp/Platform/Content/LuxiviePostsAdapter.php`
- `app/Services/WhatsApp/Platform/Content/SiteContentAdapterResolver.php`
- `app/Services/WhatsApp/Platform/PostDraftConversation.php`
- `app/Services/WhatsApp/Platform/PlatformOperatorCommandRouter.php`
- `app/Services/WhatsApp/Platform/PlatformOperatorResponseFormatter.php`
- `database/seeders/LuxivieWhatsAppTestSeeder.php`
- `tests/Feature/WhatsApp/LuxivieWhatsAppFlowTest.php`
- `tests/Feature/WhatsApp/PlatformOperatorPostDraftConversationTest.php`
