# Genasys Frontend Developer Assessment

Angular 21 (satisfies the brief's "Angular CLI 19+" requirement) + NgRx + Angular Material
implementation of the Genasys Frontend Developer technical assessment.

## What's implemented

- **Routing** — lazy-loaded `customers`/`quotes` feature routes; NgRx state for each
  feature is registered per-route too, so it code-splits along with the route.
- **Customer Management** — Material table (sort), add/edit reactive form with a
  multi-address `FormArray`, full NgRx CRUD (add/update/delete), delete gated by a
  Material confirmation dialog.
- **Quote Management** — Material table (sort, customer-name filter), add/edit form
  (with a customer picker for quotes created without prior context), full NgRx CRUD,
  same delete-confirmation pattern, and navigation from a customer's row to their
  filtered quotes.
- **Task 5 — AI enrichment panel** (built with AI, per the brief) — on the customer
  form: debounced surname → Nationalize nationality prediction → confirm or override
  against the full country list (countries.dev) → search-as-you-type university lookup
  (hipolabs) scoped to the confirmed country. All three live external APIs, no mocking.

## AI usage

Every AI prompt used while building this (cleaned up for readability) is logged in
[`PROMPTS.md`](./PROMPTS.md), with Task 5 documented in the most detail per the brief's
instructions. Tasks 2–4 were AI-assisted for setup, debugging, and explanations; the
core reducer/effect/form logic was written by the author.

## Development server

To start a local development server, run:

```bash
pnpm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
pnpm build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
pnpm test
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
