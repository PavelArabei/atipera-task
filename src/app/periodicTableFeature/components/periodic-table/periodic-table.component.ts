import {
  AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import {
  EditElementDialogComponent,
} from '@periodicTableFeature/components/edit-element-dialog/edit-element-dialog.component';
import {
  EXAMPLE_DATA,
  PeriodicTableColumnNames,
  PeriodicTableItem,
} from '@periodicTableFeature/const/periodicTableExample';
import { FilterFormEmitterService } from '@periodicTableFeature/services/filter-form-emitter.service';
import { updateDataSource } from '@periodicTableFeature/utility/updateDataSource';
import { rxState } from '@rx-angular/state';

import { PeriodicTableDataSource } from './periodic-table-datasource';

export interface PeriodicTableState {
  dataSource: PeriodicTableItem[];
}

@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeriodicTableComponent implements OnInit, AfterViewInit {
  private state = rxState<PeriodicTableState>(({ set }) => {
    set({ dataSource: EXAMPLE_DATA });
  });
  stateDataSource$ = this.state.select(('dataSource'));

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<PeriodicTableItem>;

  private readonly dialog = inject(MatDialog);
  private readonly filterFormEmitter = inject(FilterFormEmitterService);

  protected readonly displayedColumns:PeriodicTableColumnNames[] = ['position', 'name', 'weight', 'symbol'];
  private dataSource!: PeriodicTableDataSource;

  ngOnInit(): void {
    this.dataSource = new PeriodicTableDataSource(this.filterFormEmitter.filteredWord$, this.stateDataSource$);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
  }

  openDialog(rowData:PeriodicTableItem) {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      data: rowData,
    });

    const closeDialog = dialogRef.afterClosed();
    this.state.connect(
      'dataSource',
      closeDialog,
      (state, data) => updateDataSource(state.dataSource, data)
    );
  }
}
