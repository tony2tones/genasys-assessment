import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';

import { EnrichmentService } from '../../../../core/services/enrichment.service';
import { Country, NationalityPrediction } from '../../../../shared/models/country.model';
import { University } from '../../../../shared/models/customer.model';

export interface EnrichmentResult {
  nationality: string;
  university?: University;
}

/**
 * Task 5 enrichment panel: debounced surname -> Nationalize predictions ->
 * confirm/override against the full country list -> search-as-you-type
 * university lookup scoped to the confirmed country.
 */
@Component({
  selector: 'app-nationality-enrichment',
  templateUrl: './nationality-enrichment.component.html',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DecimalPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NationalityEnrichmentComponent {
  private readonly enrichment = inject(EnrichmentService);

  readonly surname = input<string>('');
  readonly initialNationality = input<string>();
  readonly initialUniversity = input<University>();
  readonly enrichmentChange = output<EnrichmentResult>();

  protected readonly countries = toSignal(this.enrichment.getCountries(), {
    initialValue: [] as Country[],
  });

  protected readonly predictions = signal<NationalityPrediction[]>([]);
  protected readonly predicting = signal(false);
  protected readonly selectedCountry = signal<Country | undefined>(undefined);

  protected readonly countrySearchControl = new FormControl('', { nonNullable: true });
  private readonly countrySearchValue = toSignal(this.countrySearchControl.valueChanges, {
    initialValue: '',
  });
  protected readonly filteredCountries = computed(() => {
    // countrySearchControl.value is a plain getter, not a signal — reading
    // it directly here wouldn't make this computed() reactive to typing, so
    // it's read via toSignal(valueChanges) instead.
    const search = this.countrySearchValue().trim().toLowerCase();
    const all = this.countries();
    return (search ? all.filter((c) => c.name.toLowerCase().includes(search)) : all).slice(0, 25);
  });

  protected readonly universityQueryControl = new FormControl('', { nonNullable: true });
  protected readonly universityResults = signal<University[]>([]);
  protected readonly searchingUniversities = signal(false);
  protected readonly selectedUniversity = signal<University | undefined>(undefined);

  private initializedFromExisting = false;

  constructor() {
    // Debounced surname -> Nationalize. distinctUntilChanged + a minimum
    // length stop it firing on every keystroke or on trivial/empty input.
    toObservable(this.surname)
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((surname) => surname.trim().length > 1),
        switchMap((surname) => {
          this.predicting.set(true);
          return this.enrichment.predictNationality(surname);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((predictions) => {
        this.predicting.set(false);
        this.predictions.set(predictions);
      });

    // Debounced university search-as-you-type, scoped to the confirmed country.
    this.universityQueryControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          const country = this.selectedCountry();
          // Selecting an option writes the University object itself back
          // into the control (that's what displayWith renders as text), so
          // valueChanges can emit a non-string here — not just typed text.
          if (!country || typeof query !== 'string' || query.trim().length < 2) {
            return of<University[]>([]);
          }
          this.searchingUniversities.set(true);
          return this.enrichment.searchUniversities(country.name, query);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((results) => {
        this.searchingUniversities.set(false);
        this.universityResults.set(results);
      });

    // Pre-fill from an existing customer's saved enrichment (edit mode),
    // once — waits for the country list so the flag/name can be resolved.
    effect(() => {
      if (this.initializedFromExisting) {
        return;
      }
      const countries = this.countries();
      const nationality = this.initialNationality();
      const university = this.initialUniversity();
      if (!nationality && !university) {
        return;
      }
      if (nationality && !countries.length) {
        return;
      }

      if (nationality) {
        const match = countries.find((c) => c.alpha2Code === nationality);
        if (match) {
          this.selectedCountry.set(match);
        }
      }
      if (university) {
        this.selectedUniversity.set(university);
      }
      this.initializedFromExisting = true;
    });
  }

  // mat-autocomplete writes the selected option's raw value back into the
  // bound input — since our option values are Country/University objects,
  // not strings, displayWith is required or the input renders "[object
  // Object]" once a selection is made.
  protected readonly displayCountry = (country: Country | null): string =>
    country ? `${country.flag} ${country.name}` : '';

  protected readonly displayUniversity = (university: University | null): string =>
    university ? university.name : '';

  protected countryFor(code: string): Country | undefined {
    return this.countries().find((c) => c.alpha2Code === code);
  }

  protected selectPrediction(prediction: NationalityPrediction): void {
    const country = this.countryFor(prediction.countryCode);
    if (country) {
      this.confirmCountry(country);
    }
  }

  protected confirmCountry(country: Country): void {
    this.selectedCountry.set(country);
    this.selectedUniversity.set(undefined);
    this.universityQueryControl.setValue('');
    this.universityResults.set([]);
    this.countrySearchControl.setValue('');
    this.emitChange();
  }

  protected changeCountry(): void {
    this.selectedCountry.set(undefined);
    this.selectedUniversity.set(undefined);
  }

  protected selectUniversity(university: University): void {
    this.selectedUniversity.set(university);
    this.emitChange();
  }

  private emitChange(): void {
    const country = this.selectedCountry();
    if (!country) {
      return;
    }
    this.enrichmentChange.emit({ nationality: country.alpha2Code, university: this.selectedUniversity() });
  }
}
