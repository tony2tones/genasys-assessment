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

---

## Session 4 — Task 5: AI-only enrichment panel (2026-08-23)

**Relates to:** Objective 5 (the enrichment panel), specifically built with AI as
instructed by the assessment brief — this session is logged in more detail than
Tasks 2–4 for that reason.

**Prompt (cleaned up):**
> I need to get this assignment finished. I've added filtering for the customer list,
> and I still need a way to select a customer when creating a quote, plus the AI
> enrichment panel from Task 5 — could you build both?

**What Claude did:**
- Verified the real response shapes of all three external APIs (Nationalize,
  countries.dev, hipolabs) with direct `curl` calls before writing any parsing code,
  rather than guessing field names against a live, ungraded-if-wrong integration.
- Added `provideHttpClient()` to `app.config.ts` (missing until this point — nothing had
  called an HTTP API yet).
- Built `EnrichmentService` (`core/services/enrichment.service.ts`): `predictNationality`
  (debounce/backoff is the caller's job; the service just wraps the call and treats
  empty predictions and failures — including 429s — the same way, as "no predictions"),
  `getCountries` (fetched once and cached via `shareReplay(1)`, per the brief), and
  `searchUniversities`.
- Built `NationalityEnrichmentComponent` (`features/customers/components/nationality-
  enrichment/`): debounced (500ms) surname → prediction chips showing flag/name/
  probability; a searchable `mat-autocomplete` over the full country list as an override;
  once a country is confirmed, a second debounced (300ms) search-as-you-type university
  lookup scoped to that country via another `mat-autocomplete`; pre-fills from an
  existing customer's saved `nationality`/`university` in edit mode.
- Wired it into `CustomerFormPageComponent`: the panel reads the form's `lastName`
  control reactively (`toSignal(valueChanges)`), and emits back up to two signals that
  get merged into the dispatched `Customer` object on submit (falling back to the
  existing customer's saved values if the panel was never touched, so editing a customer
  without re-touching the enrichment panel doesn't blank those fields out).
- Live-tested the whole chain in a real browser against the real APIs (not mocked) —
  caught and fixed three bugs this way that wouldn't have shown up from reading the code
  alone: (1) selecting a country/university rendered the input as literal
  `"[object Object]"` because `mat-autocomplete` needs an explicit `displayWith` function
  when option values are objects, not strings; (2) that same object-not-string value
  then crashed the debounced university-search pipeline with `query.trim is not a
  function`, since selecting an option also re-fires `valueChanges` with the selected
  object, not just user-typed strings; (3) the country search box's live-filtering
  `computed()` was reading a plain `FormControl.value` getter directly, which Angular's
  `computed()` doesn't track as a reactive dependency — needed `toSignal(valueChanges)`
  instead for typing to actually filter the list.
- Later, after this work had been set aside with `git stash push -u` (so Customer/Quotes
  could be tested in isolation without Task 5 in the way) and the isolated work got
  committed and merged on its own branch, restored Task 5 with `git stash pop` — this
  landed on a branch that had diverged further than expected, producing two real merge
  conflicts in `customer-form-page.component.ts`/`.html` where both the enrichment
  wiring and separately-added form-validation work touched overlapping regions. Resolved
  both by hand, keeping every change from both sides, then re-verified the *combined*
  result end to end in a live browser (create with prediction → country override search
  → university search → submit → edit → confirm pre-fill), rather than trusting that a
  clean `git diff` alone meant the merge was semantically correct.

**Outcome:** working enrichment panel, verified end to end against the live Nationalize,
countries.dev, and hipolabs APIs (not stubbed) — debounced prediction, confirm/override
via a searchable country list, scoped university search-as-you-type, and correct
persistence/pre-fill of `nationality`/`university` on the customer record through both
the add and edit flows, with no console errors.

---

## Session 5 — Pre-submission review and polish (2026-08-23)

**Relates to:** all objectives (review pass), Objective 2.3.2 and 3.3 specifically
(the two gaps found and fixed).

**Prompt (cleaned up):**
> Could you review my submission against the assessment and give feedback on areas to
> improve? [Then, after the review:] Let's do those steps to wrap up for Monday — update
> the README, add the Task 5 entry to PROMPTS.md, and open a new branch to address the
> remaining issues you flagged. [Then:] Can we merge main and address the filtering gaps
> and other loose ends from the review? [Then:] Can we also center the status pill under
> the Status column header?

**What Claude did:**
- Reviewed the actual current code (not just memory of earlier sessions) against every
  objective and acceptance criterion, and found two concrete, checkable gaps: the
  customer list had a `filterText` signal declared but never wired to anything — no
  input, no filtering — so Objective 2.3.2 ("filtering and sorting") only had sorting
  working; and the quote list had no status filter at all, only customer-name, so
  Objective 3.3 ("filtering by customer or status") was half-done. Also flagged (as
  lower priority, since neither is an explicit requirement): zero test coverage beyond
  the original scaffolded spec, and a generic, unedited README.
- Updated the README with a project overview and a pointer to this prompt log.
- Added a status filter (`mat-select`) to the quote list, folded into the existing
  `filteredQuotes` computed() alongside the customer-name filter.
- Centered the status pill under the Status column header, using the same
  `mat-column-<name>` targeting technique already used for the actions column's
  right-alignment.
- Verified every change live in the browser (typed a filter, picked a status, confirmed
  the list narrowed correctly each time) rather than trusting the build alone, and
  checked the console stayed clean throughout.

**Outcome:** both explicit-requirement gaps from the review closed and verified live;
`main` now has Task 5 merged; `assessment-polish` carries the filter fixes and the
status-pill alignment fix, ready to be reviewed/merged when the author chooses.

