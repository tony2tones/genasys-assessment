import { Component, input } from '@angular/core';

// TODO: Objective 3 — Material table of quotes (TABLE_IMPORTS from
// shared/material/table.imports.ts), local signals for status filter + sort,
// and a customer filter that defaults to the `customerId` query param below
// (bound automatically via withComponentInputBinding in app.config.ts) but
// can also be changed in-page — both should drive the same filtered view.
@Component({
  selector: 'app-quote-list-page',
  template: `<p>Quote list page — TODO (customerId filter: {{ customerId() }})</p>`,
})
export class QuoteListPageComponent {
  customerId = input<string>();
}
