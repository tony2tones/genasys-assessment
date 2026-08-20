import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';

import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/ui/confirm-dialog/confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private readonly dialog = inject(MatDialog);

  confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog
      .open(ConfirmDialogComponent, { data, width: '400px' })
      .afterClosed()
      .pipe(map((result) => result === true));
  }
}
