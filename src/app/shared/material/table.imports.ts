import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

/**
 * Convenience array of the Material modules every list-page table needs
 * (sort, paginate, row actions). Spread into a component's `imports: []`,
 * e.g. `imports: [...TABLE_IMPORTS]`.
 */
export const TABLE_IMPORTS = [
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatIconModule,
] as const;
