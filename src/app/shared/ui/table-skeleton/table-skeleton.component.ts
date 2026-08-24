import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Shimmering placeholder rows shown in place of a Material table while its
 * data is loading. Row/column counts are configurable since the two tables
 * using it (customers, quotes) have different column counts.
 */
@Component({
  selector: 'app-table-skeleton',
  templateUrl: './table-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSkeletonComponent {
  readonly rows = input(5);
  readonly columns = input(4);

  protected readonly rowIndexes = computed(() => Array.from({ length: this.rows() }));
  protected readonly columnIndexes = computed(() => Array.from({ length: this.columns() }));
}
