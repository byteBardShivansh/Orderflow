OrderFlow

OrderFlow is a lean, microservice-style backend system for order processing, designed to resemble a realistic early-stage startup architecture.
It prioritizes clarity, pragmatism, and production-shaped patterns without heavy infrastructure or over-engineering.

The system is intentionally mostly production-ready, while retaining a few realistic gaps that would typically surface during a deeper architecture or production-readiness review.

Architecture Overview
api-gateway           → Entry point, auth, RBAC, rate limiting
auth-service          → Token issuance and verification
order-service         → Core order lifecycle and metrics
payment-service       → Downstream payment integration
notification-worker   → Background notification processing
shared                → Shared types, config, utilities


The API Gateway acts as the system boundary, while services remain modular and independently testable.

Tech Stack

Node.js

TypeScript

Express

Axios

Jest

Simulated PostgreSQL (in-memory repository)

Simulated Redis queue (in-memory)

Dependencies are kept intentionally minimal.

Key Design Decisions
1. Microservice-style Structure (Without Infra Overhead)

Services are separated by responsibility and dependency boundaries, but run in a single Node.js process for simplicity.

This keeps the architecture reviewable without introducing Kubernetes, Docker, or orchestration complexity.

2. API Gateway Pattern

The gateway is responsible for:

Authentication

RBAC enforcement

Correlation ID generation

Rate limiting

Error handling

Route composition

Business services assume a trusted caller.

3. Configuration & Environment Handling

All runtime configuration is centralized in shared/config.ts.

Secrets are environment-driven, though key rotation is intentionally not implemented.

4. Observability (Partial by Design)

Structured logging using JSON logs

Correlation IDs at request boundaries

Metrics implemented only in order-service

Health endpoint for liveness checks

There is no alerting system — logs are the primary signal.

5. Reliability Patterns

Implemented:

Request timeouts

Retry logic for downstream payment calls

Basic rate limiting

Intentionally missing:

Circuit breakers

Distributed rate limiting

Idempotency guarantees for payment retries

Dead-letter queue for background jobs

These tradeoffs reflect a fast-moving startup system.

6. Feature Flags

A simple in-memory feature flag system is included to demonstrate controlled rollout capability.

Flag changes are not audited.

Known Gaps & Intentional Tradeoffs

This codebase is not perfect by design.

Notable limitations:

RBAC enforced only at the API layer

No payment idempotency keys

No circuit breaker for external calls

No Redis dead-letter queue

Correlation IDs not propagated to background workers

Limited integration and failure-mode tests

Shared types are versioned by convention only

Feature flag changes have no audit trail

These reflect common real-world shortcuts taken by early-stage teams.

Running the Project
Install dependencies
npm install

Start API Gateway
npm run start


The server will start on the configured port (default: 3000).

Start Notification Worker
npm run worker

Run Tests
npm test

Example Endpoints

POST /login – obtain JWT token

POST /orders – create an order (authenticated)

GET /orders?page=1&limit=10 – list orders

GET /health – liveness check

When This Architecture Works Well

Single-node or small-cluster deployments

Early-stage startups

Systems prioritizing clarity over scale

Architecture reviews and system design exercises

When It Needs Evolution

High-volume traffic

Strict compliance or security environments

Financial systems requiring strong idempotency guarantees

Multi-region deployments

Strong SLO/SLA enforcement

Future Improvements

Idempotency keys for payment operations

Circuit breaker implementation

Distributed rate limiting

Dead-letter queue for workers

Metrics expansion across services

Feature flag audit trail

Contract version enforcement between services