import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import {
  merge, Observable, of as observableOf, Subject, Subscription
} from 'rxjs';
import { map } from 'rxjs/operators';

export interface PeriodicTableItem {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

export type PeriodicTableColumnNames = keyof PeriodicTableItem;

interface Filter {
  filterWord$: Observable<string>;
  filteredWord: string ;
  filterSub:Subscription;
}

const EXAMPLE_DATA: PeriodicTableItem[] = [
  {
    position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'
  },
  {
    position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'
  },
  {
    position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'
  },
  {
    position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'
  },
  {
    position: 5, name: 'Boron', weight: 10.811, symbol: 'B'
  },
  {
    position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'
  },
  {
    position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'
  },
  {
    position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'
  },
  {
    position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'
  },
  {
    position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'
  },
];

/**
 * Data source for the PeriodicTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class PeriodicTableDataSource extends DataSource<PeriodicTableItem> {
  data: PeriodicTableItem[] = EXAMPLE_DATA;
  sort: MatSort | undefined;

  private filter!:Filter;

  private newDataEmitter = new Subject<PeriodicTableItem>();
  get newData$(): Observable<PeriodicTableItem> {
    return this.newDataEmitter.asObservable();
  }

  constructor(filterWord$: Observable<string>) {
    super();
    this.createFilterSub(filterWord$);
  }

  connect(): Observable<PeriodicTableItem[]> {
    if (this.sort) {
      return merge(
        observableOf(this.data),
        this.sort.sortChange,
        this.filter.filterWord$,
        this.newData$
      )
        .pipe(
          map(() => this.filterData()),
          map((filteredData: PeriodicTableItem[]) => this.getSortedData([...filteredData])),

        );
    }
    throw Error('Please set the sort on the data source before connecting.');
  }

  public updateData(rowData:PeriodicTableItem): void {
    this.data = this.data.map((item: PeriodicTableItem) => {
      if (isElemetChanged(item, rowData)) {
        return rowData;
      }
      return item;
    });

    this.newDataEmitter.next(rowData);
  }

  private filterData(): PeriodicTableItem[] {
    if (this.filter.filteredWord === '') {
      return this.data;
    }

    return this.data.filter((item: PeriodicTableItem) => {
      let result = false;
      const keysArray = Object.keys(item) as (keyof PeriodicTableItem)[];

      keysArray.forEach((key) => {
        const tableField = item[key];
        if (isIncludesWord(tableField, this.filter.filteredWord)) result = true;
      });

      return result;
    });
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

  private createFilterSub(filterWord$: Observable<string>) {
    const filterSub = filterWord$.subscribe((word) => {
      if (this.filter) {
        this.filter.filteredWord = word;
      }
    });

    this.filter = {
      filterWord$,
      filteredWord: '',
      filterSub
    };
  }

  disconnect(): void {
    this.filter.filterSub.unsubscribe();
  }
}

function isIncludesWord(field: string | number, word: string): boolean {
  const stringField = field.toString();
  return stringField.toLowerCase().includes(word);
}

function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function isElemetChanged(element: PeriodicTableItem, newElement: PeriodicTableItem): boolean {
  return element.position === newElement.position
    || element.name === newElement.name
    || element.weight === newElement.weight
    || element.symbol === newElement.symbol;
}
