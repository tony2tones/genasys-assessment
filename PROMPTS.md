# AI Prompt Log

This file logs prompts used with Claude Code while building this assessment, per the
Genasys assessment's AI-usage requirement. Prompts are cleaned up for grammar/clarity
(English is not the author's first language) but keep the original intent and meaning.
Each entry notes which objective(s) it relates to and a short summary of the outcome.

Tasks 2–4 (routing, Customer/Quote Management, NgRx CRUD) were AI-assisted for project
setup only — the core feature implementation (forms, tables, reducers/effects logic) was
written by the author. Task 5 (the AI enrichment panel) was built with AI as instructed
by the assessment brief, and is logged in more detail below as work on it progresses.

---

## Session 1 — Project setup & scaffolding (2026-08-19)

**Relates to:** Setup instructions; Objective 1 (Routing); groundwork for Objectives 2–4.

**Prompt (cleaned up):**
> I have this Genasys frontend developer assessment (PDF). I'd like to do most of the
> implementation myself, but I need help getting set up correctly first: confirming I'm
> on the right Angular version, installing Angular Material and NgRx, and sorting out the
> routing. I also want a day-by-day plan of attack since the deadline is Monday 10am, and
> I'd like every prompt I use logged (cleaned up, since my English can be rough) so I can
> review it later.

Follow-up answers given during planning: keep the existing Angular 21.2 scaffold (it
already satisfies the assessment's "Angular CLI 19+" requirement, so no downgrade);
use Angular Material's prebuilt Azure/Blue theme; scaffold both the infrastructure
(installs, providers, folders, routes) and empty NgRx skeletons (actions/selectors fully
written, reducer/effects left as TODOs) so the graded NgRx logic is written by the author.

**What Claude did:**
- Reviewed the assessment PDF and the existing repo scaffold (Angular 21.2, standalone,
  zoneless, strict TypeScript, Vitest test runner, Tailwind v4 already wired via PostCSS).
- Designed the architecture: `@ngrx/entity` for both features, per-feature lazy
  `provideState`/`provideEffects` (so NgRx state code-splits with the lazy routes), a
  query-param (`?customerId=`) for the customer→quotes navigation, local component
  signals for table filter/sort state (not stored in NgRx), and an effect-gated Material
  dialog pattern for delete confirmation.
- Installed `@angular/material` (`ng add`, Azure/Blue M3 theme, async animations) and
  `@ngrx/store`, `@ngrx/effects`, `@ngrx/entity`, `@ngrx/store-devtools`.
- Scaffolded `core/`, `shared/` (models, confirm-dialog component/service, table
  Material-imports helper), and `features/customers`, `features/quotes` (data services
  with simulated-latency mock CRUD, fully-written NgRx actions/selectors, reducer/effects
  skeletons with TODO comments, lazy routes, placeholder page components).
- Wired root providers in `app.config.ts` (router with `withComponentInputBinding`,
  animations, empty root store/effects, store devtools) and replaced the placeholder
  app shell with a `mat-toolbar` nav (Customers / Quotes links) + `router-outlet`.
- Updated `app.spec.ts` for the new shell; set up this prompt log.

**Outcome:** clean base to build on — `pnpm start` boots with working lazy-loaded
navigation between empty Customers/Quotes pages, Material + Tailwind coexist without
conflict, and the NgRx skeletons compile with TODOs marking exactly what to fill in.
