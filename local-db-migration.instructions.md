# Local Data Migration Instructions

This instruction file supports the `local-db-migration.agent.md` agent.

## Goal
Migrate the `morocco-travel` app from static local data files and hard-coded fixtures to a real local database layer.

## Checklist
1. Identify all static data sources
   - `data/*.json`
   - `src/lib/*` modules that import or reference JSON data
   - components and pages that consume static arrays or objects directly
2. Create a database adapter layer
   - add `src/lib/db.ts` or `src/lib/database.ts`
   - expose query functions for trips, destinations, bookings, and leads
3. Replace static reads with database queries
   - update API routes under `src/app/api/*`
   - update page-level data loading and server components
   - update client-side hooks/components that currently use static data utilities
4. Preserve current app behavior
   - keep response shapes consistent with existing APIs
   - preserve filters, sorting, and relations used by pages
5. Prepare for real local DB integration
   - use a single `db` adapter layer instead of ad hoc imports
   - keep static JSON fixtures only for seed data or initial migration
   - document schema and query contracts in code comments

## Recommended structure
- `src/lib/db.ts` — database connection and adapter helpers
- `src/lib/trip-db.ts` — trip-specific queries
- `src/lib/destination-db.ts` — destination-specific queries
- `src/lib/booking-db.ts` — booking-specific queries
- `src/lib/lead-db.ts` — lead/contact queries
- `src/lib/data.ts` — migration helpers and seed loaders

## When to use this file
Use this file with the `local-db-migration.agent.md` agent whenever you want the agent to:
- focus on data-layer refactor work
- ensure static fixtures are replaced cleanly
- keep the app ready for a real local database later

## Next customization ideas
- add `database-schema.instructions.md` for schema design and normalization guidelines
- create `db-seed.agent.md` for seed data import and migration script generation
- add `api-route-migration.agent.md` for Next.js API route conversion best practices
