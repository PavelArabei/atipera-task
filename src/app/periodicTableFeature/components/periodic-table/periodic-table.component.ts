import {
  AfterViewInit, Component, OnInit, ViewChild
} from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';

import { FilterFormEmitterService } from '../../services/filter-form-emitter.service';
import { PeriodicTableColumnNames, PeriodicTableDataSource, PeriodicTableItem } from './periodic-table-datasource';

@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule]
})
export class PeriodicTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<PeriodicTableItem>;
  dataSource!: PeriodicTableDataSource;

  displayedColumns:PeriodicTableColumnNames[] = ['position', 'name', 'weight', 'symbol'];

  constructor(private readonly filterFormEmitter: FilterFormEmitterService) {
  }

  ngOnInit(): void {
    this.filterFormEmitter.filteredWord$.subscribe();
    this.dataSource = new PeriodicTableDataSource(this.filterFormEmitter.filteredWord$);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
  }
}
