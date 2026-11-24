# My learnings

- SvelteKit + Svelte 5 (runes) + Prisma/PostgreSQL. Scripts: `yarn run check`, `npx eslint <files>`. `yarn check` is Yarn's built-in, not the project script.
- Path aliases: `@/*` -> `src/*`, `@components/*` -> `src/components/*`.
- Admin pages live under `src/routes/admin/**`; `src/routes/admin/+layout.server.ts` already requires `user.isAdmin`. Fine-grained edit permissions live on the populated user (`isPengU`, `isPengUChief`, `canApprove`) from `src/helpers/user.helpers.ts`; admin pages currently use `isPengU` for editing accounting data.
- Voucher list pages: `/admin/vouchers` (inlämnat, grouped by type server-side) and `/admin/vouchers/archive` (client-side Fuse.js search). Keep search keys/options consistent between them.
- Prisma models are mapped to snake_case tables (`project`, `profit_center`). Migrations are raw SQL in `prisma/migrations/<timestamp>_<name>/migration.sql`; run `yarn prisma:generate` after schema changes.
- Fortnox project sync (`src/routes/admin/fortnox/projects/+server.ts`) upserts projects; preserve local-only fields when adding them.
- Project ↔ cost center filtering (`projectMatchesProfitCenter`) uses `Project.profitCenterName`; unassigned projects are shown for every cost center. Report options carry `profitCenterName` so the Resultat page filters the same way.
- Resultat supports `account`, `project`, and (when no cost center filter) `costCenter` breakdowns from `aggregateResultat`. Project editing keeps local drafts separate from saved `data.projects`, so rows only regroup after a successful save/invalidation.
- Form pattern: page server action validates with Zod + `formatZodErrors`, returns `success()`, client uses `use:enhance={responseHandler}` and JSON-encodes the edited row in a hidden input.
