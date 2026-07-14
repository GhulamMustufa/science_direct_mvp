# Project Context

Project:
Research Publishing Platform (ScienceDirect-inspired MVP)

## Tech Stack

Frontend:
- Next.js App Router
- TypeScript
- Tailwind CSS
- ShadCN UI

Backend:
- Express.js
- TypeScript

Database:
- PostgreSQL (Supabase)

ORM:
- Drizzle ORM

Storage:
- Firebase Storage

Authentication:
- JWT

Validation:
- Zod

Search:
- PostgreSQL Full Text Search

Publishing:
- Internal platform (End-to-End)

## Architecture Rules

- Frontend and backend are separate projects.
- Never move backend into Next.js API routes.
- Internal Submission and Editorial Workflow.
- PostgreSQL is source of truth.
- Use feature-based architecture.
- Use repository + service pattern.
- No microservices.
- No Kafka.
- No RabbitMQ.
- No unnecessary abstractions.

## Coding Rules

- Always follow CODE_OPTIMIZATION_RULES.md.
- Do not introduce unnecessary performance patterns unless required.
- TypeScript only.
- No any.
- Use Zod validation.
- Keep functions under 50 lines.
- Use dependency injection where appropriate.
- Prefer composition.
- Reuse components.
- Ask before adding dependencies.