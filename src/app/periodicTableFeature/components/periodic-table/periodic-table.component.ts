import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';

import { FilterFormEmitterService } from '../../services/filter-form-emitter.service';
import { EditElementDialogComponent } from '../edit-element-dialog/edit-element-dialog.component';
import { PeriodicTableColumnNames, PeriodicTableDataSource, PeriodicTableItem } from './periodic-table-datasource';

@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeriodicTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<PeriodicTableItem>;

  private readonly dialog = inject(MatDialog);
  private readonly filterFormEmitter = inject(FilterFormEmitterService);

  private destroyRef = inject(DestroyRef);

  protected readonly displayedColumns:PeriodicTableColumnNames[] = ['position', 'name', 'weight', 'symbol'];
  private dataSource!: PeriodicTableDataSource;

  ngOnInit(): void {
    this.dataSource = new PeriodicTableDataSource(this.filterFormEmitter.filteredWord$);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
  }

  openDialog(rowData:PeriodicTableItem) {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      data: rowData,
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data:PeriodicTableItem | undefined) => {
        if (data) {
          this.dataSource.updateData(data);
        }
      });
  }
}
