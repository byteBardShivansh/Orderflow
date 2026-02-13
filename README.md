# OrderFlow

OrderFlow is a lean, microservice-style backend for order processing. It aims to look and feel like a pragmatic early-stage startup system: clear responsibilities, low infrastructure overhead, and production-shaped patterns without over-engineering.

---

## Table of Contents
- Overview
- Architecture
- Tech Stack
- Getting Started
- Configuration
- Endpoints
- Service Responsibilities
- Observability & Reliability
- Known Gaps (Intentional Tradeoffs)
- When to Use / When to Evolve
- Future Improvements

---

## Overview
- Single entry point via an API Gateway
- Auth via JWT
- In-memory order store and metrics
- External payment integration with retries/timeouts
- Background worker scaffold for notifications

---

## Architecture
api-gateway           → Entry point, auth, RBAC, rate limiting

auth-service          → Token issuance and verification

order-service         → Core order lifecycle and metrics

payment-service       → Downstream payment integration (HTTP)

notification-worker   → Background notification processing (placeholder)

shared                → Shared types, config, utilities

The API Gateway is the boundary. Services remain modular and independently testable.

---

## Tech Stack
- Node.js
- TypeScript
- Express
- Axios
- Jest
- In-memory repository (simulated PostgreSQL)
- In-memory queue (simulated Redis)

Dependencies are intentionally minimal.

---

## Getting Started
1) Install dependencies
   - npm install

2) Start API Gateway
   - npm run start
   - Server listens on configured port (default: 3000)

3) Start Notification Worker (placeholder)
   - npm run worker

4) Run tests (skeleton only)
   - npm test

---

## Configuration
Configuration is centralized in shared/config.ts and environment variables:
- PORT: Port for the API (default: 3000)
- JWT_SECRET: Secret for signing JWTs (default: dev-secret)
- PAYMENT_URL: Base URL for the payment service (default: https://fake-payments)
- REQUEST_TIMEOUT_MS: Per-request timeout for downstream calls (default: 2000)
- MAX_RETRIES: Retries for payment client (default: 3)

---

## Endpoints
Public
- POST /login
  - Body: { "userId": string, "role": "ADMIN" | "CUSTOMER" }
  - Response: { "token": string }

- GET /health
  - Response: { "status": "ok" }

Protected (Authorization: Bearer <token>)
- POST /orders
  - Body: { "amount": number }
  - Responses:
    - 201: { id, userId, amount, status, createdAt }
    - 400: { error }
    - 500: { error } (propagated from payment failure)

- GET /orders?page=<number>&limit=<number>
  - Default: page=1, limit=10
  - Response: Array<{ id, userId, amount, status, createdAt }>

---

## Service Responsibilities
- API Gateway
  - Route composition, authentication, correlation ID, error handling, rate limiting (naive in-memory)
  - RBAC middleware exists, not currently applied to routes

- Auth Service
  - Issues and verifies JWTs; roles: ADMIN, CUSTOMER

- Order Service
  - Create orders, list orders, maintain in-memory store and simple metrics
  - On create: attempts payment then marks PAID, otherwise marks FAILED

- Payment Service
  - HTTP client to external payment endpoint: POST {PAYMENT_URL}/charge
  - Retries with timeout; no idempotency keys or circuit breaker

- Notification Worker
  - Placeholder for async notifications; no implementation yet

- Shared
  - Config, types, enums, feature flags, logger, retry utility

---

## Observability & Reliability
- Logging: Structured JSON logs (shared/logger)
- Correlation: x-correlation-id assigned at gateway and returned in response
- Metrics: order-service/metrics.ts tracks total and failed orders (in-memory)
- Reliability patterns implemented
  - Request timeouts
  - Simple retry on payment client
  - Basic rate limiting (per-IP, in-memory)

Limitations
- No circuit breaker
- No distributed rate limiting / windowing
- No idempotency keys for payment retries
- No dead-letter queue for workers
- Correlation IDs not propagated to background workers or external calls

---

## Known Gaps (Intentional Tradeoffs)
- RBAC enforced only at API layer and not used on routes
- In-memory state (orders, metrics) – no persistence
- Error handler leaks internal error messages
- Middleware order: rateLimit is registered after routes; should ideally be before
- Empty files: payment.service.ts, notification-worker/queue.ts, notification-worker/worker.ts, tests/
- Limited integration and failure-mode tests

---

## When to Use / When to Evolve
Works well for
- Single-node or small-cluster deployments
- Early-stage teams prioritizing clarity
- Architecture reviews and design exercises

Needs evolution for
- High-volume traffic
- Strict compliance/security
- Financial-grade idempotency requirements
- Multi-region deployments and strong SLO/SLA

---

## Future Improvements
- Idempotency keys for payment operations
- Circuit breaker for external calls
- Distributed rate limiting with windowing
- Dead-letter queue for workers
- Metrics expansion across services
- Feature flag audit trail

Contract version enforcement between services