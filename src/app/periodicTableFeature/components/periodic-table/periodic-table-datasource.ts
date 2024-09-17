import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { PeriodicTableItem } from '@periodicTableFeature/const/periodicTableExample';
import { getFilteredData } from '@periodicTableFeature/utility/filterDataSource';
import { merge, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

export class PeriodicTableDataSource extends DataSource<PeriodicTableItem> {
  private data$: Observable<PeriodicTableItem[]>;
  private filterWord$: Observable<string>;
  sort: MatSort | undefined;

  constructor(filterWord$: Observable<string>, stateDataSource$: Observable<PeriodicTableItem[]>) {
    super();
    this.filterWord$ = filterWord$;
    this.data$ = stateDataSource$;
  }

  connect(): Observable<PeriodicTableItem[]> {
    if (this.sort) {
      return merge(
        this.data$,
        this.sort.sortChange,
        this.filterWord$,
      )
        .pipe(
          switchMap((event) => this.data$.pipe(
            map((data: PeriodicTableItem[]) => getFilteredData(data, event)),
            map((data: PeriodicTableItem[]) => this.getSortedData([...data])),
          ))
        );
    }
    throw Error('Please set the sort on the data source before connecting.');
  }

  private getSortedData(data: PeriodicTableItem[]): PeriodicTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'position': return compare(+a.position, +b.position, isAsc);
        case 'name': return compare(a.name, b.name, isAsc);
        case 'weight': return compare(+a.weight, +b.weight, isAsc);
        case 'symbol': return compare(a.symbol, b.symbol, isAsc);

        default: return 0;
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  disconnect(): void {
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
