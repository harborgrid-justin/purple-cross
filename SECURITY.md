# Security Policy

## Reporting a Vulnerability

Please report security issues privately to **security@purplecross.example** (or
via GitHub Security Advisories), not in public issues. Include reproduction
steps and impact. We aim to acknowledge within 3 business days and to provide a
remediation timeline after triage. Please do not disclose publicly until a fix
is released.

## Supported Versions

Security fixes are applied to the latest released version on `main`.

## Security Controls

The platform implements the following controls (see
`docs/PRODUCTION_GAP_ANALYSIS.md` for the current real-vs-aspirational state):

- **Authentication:** JWT access tokens (short-lived) + rotating refresh tokens
  stored only as SHA-256 hashes, with reuse detection and account lockout.
- **Authorization:** role-based access control (`ADMIN/VET/TECH/RECEPTIONIST/
  CLIENT_PORTAL`) enforced by a global authentication guard; sensitive
  endpoints add `authorize(...)`. `/metrics` and the queue dashboard are
  ADMIN-only.
- **Multi-tenancy:** tenant isolation enforced at the data layer (fail-closed
  for authenticated requests without a tenant).
- **Data protection (PHI):** AES-256-GCM field-level encryption at rest for
  clinical free-text; PII/PHI redaction in logs and error reports; append-only
  audit log for create/update/delete on core records.
- **Transport & headers:** Helmet, configurable CORS, TLS terminated at the
  ingress/Nginx.
- **Input handling:** Joi validation + input sanitization; Prisma parameterized
  queries (no raw string SQL on user input).
- **Resilience & limits:** per-IP rate limiting (stricter on auth), request
  timeouts, and circuit breakers on outbound webhooks.
- **Configuration:** fail-fast environment validation; no insecure default
  secrets; secrets supplied via a secret manager in production.
- **Supply chain:** Dependabot updates and `npm audit` in CI.

## Secrets

Never commit real secrets. `JWT_SECRET`, `JWT_REFRESH_SECRET`, and
`FIELD_ENCRYPTION_KEY` must be unique, ≥32 chars, and provisioned via a secret
manager. Rotating `FIELD_ENCRYPTION_KEY` requires re-encryption of stored
ciphertext (key-version aware migration).
