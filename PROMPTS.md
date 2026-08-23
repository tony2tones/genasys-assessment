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

---

## Session 2 — Customer CRUD: NgRx wiring, reactive form, Material table (2026-08-20 to 2026-08-21)

**Relates to:** Objective 2 (Customer Management page) and Objective 4 (Add/Edit/Delete via NgRx Store).

Author-led implementation, with AI used for explanations and debugging help as issues
came up — not for writing the core reducer/effect/form logic. Prompts across this
session (cleaned up):
- Asked for mock customer and quote data to be generated.
- Asked Claude to explain concepts while building: the `@ngrx/effects` `Actions`
  injectable and how chained effects communicate purely through the dispatched-action
  stream, the Angular Material `MatTable`/`MatSort`/`MatMenu` APIs, Reactive Forms
  (`FormBuilder`, `FormArray` vs a flat `FormGroup`), `private`/`protected`/`readonly`
  field conventions, and how `withComponentInputBinding()` + signal `input()` replaces
  `ngOnChanges` for reacting to route params.
- Asked Claude to diagnose and fix bugs as they were hit, including: a two-part bug in the
   delete flow where the confirm-dialog effect dispatched the dialog's boolean result as 
   the customer id instead of the real id, and a second effect to actually call the delete
   service was missing entirely, so deletes silently did nothing despite the confirmation 
   dialog working correctly.

**What Claude did:** explained each concept/error in place and applied direct fixes for
clearly mechanical issues (imports, typos, wiring, the delete-effect bug), while leaving
the actual NgRx reducer/effect logic and form structure for the author to design and write.

**Outcome:** working Customer Management page — a Material table with sort and a
row-actions menu (view quotes / edit / delete), a full add/edit reactive form with a
multi-address `FormArray`, and complete NgRx CRUD (add/update/delete, delete gated by a
Material confirm dialog through a two-step effect), all reflected live in the table via
signals reading from the store.

---

## Session 3 — Quote Management: NgRx CRUD, customer linking, filtering, validation (2026-08-22 to 2026-08-23)

**Relates to:** Objective 3 (Quote Management page), Objective 4 (Add/Edit/Delete via
NgRx Store, quotes side), and the "minimal console errors" / "maintainability" acceptance
criteria (form validation).

Author-led implementation, mirroring the customer feature's already-proven patterns onto
quotes, with AI used for debugging, explaining NgRx/Angular mechanics, and architectural
sanity-checks — not for writing the core reducer/effect/form logic. Prompts across this
session (cleaned up):
- Asked Claude to diagnose and fix bugs as they came up, including: the same two-part
  delete-effect bug as the customer feature (wrong id dispatched, missing second effect
  to actually call the delete service) reappearing on the quotes side; a route-ordering
  bug where a leftover `:id` route silently intercepted `/quotes/new`; a `mat-menu`
  styling issue caused by trying to style Angular Material's internal DOM from a
  component-scoped stylesheet (CDK overlay content and child-component internals both
  sit outside a parent's view encapsulation); a `var(fallback)` misunderstanding where
  editing the fallback argument had no effect because the primary CSS variable was
  already defined; a recurring `mat-table` template-scoping bug (`*matCellDef="let x"`
  variables only existing inside their own column block) 
- Asked Claude for architectural advice: whether "view a customer's quotes" needed a
  separate component/route (it didn't — one dynamic `QuoteListPageComponent` filtered by
  a `customerId` input, already built, just needed the filter wired up) or a new
  customer-scoped route (also not needed — the existing `?customerId=` query-param
  design already covers it); how to let a quote be linked to a customer when created
  without prior context (added a customer picker rendered only when no `customerId` is
  already in context, backed by registering `customersFeature`/`CustomersEffects` on the
  quotes routes too); and whether the `addresses` `FormArray` on the customer form was
  over-engineered (it wasn't — the assessment's own `Customer` interface types it as
  `Address[]`, so the shape is intentional even though multi-address UI isn't required).
- Asked for commit-message help
  summarising the staged quotes work.

**What Claude did:** explained each concept/error in place and applied direct fixes for
mechanical bugs (routing order, effect wiring, template scoping, the disabled-binding
bug, form validators), while leaving the core reducer/effect logic, component structure,
and UX decisions (customer picker vs. required-context-only) for the author to design
and confirm.

**Outcome:** working Quote Management page — Material table with sort, a customer-name
text filter alongside the existing `customerId` query-param filter, status pills, and a
row-actions menu (edit/delete, delete gated the same way as customers); a create/edit
form that can be reached either from a specific customer's context or via a standalone
customer picker, with real required-field validation on both the quote and customer
forms; and the customer↔quote navigation (Objective 3.4) working in both directions.

