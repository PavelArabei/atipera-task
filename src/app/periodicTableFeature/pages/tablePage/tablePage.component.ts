import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

import { PeriodicTableComponent } from '../../components/periodic-table/periodic-table.component';
import { PrerodicTableFilterComponent } from '../../components/prerodic-table-filter/prerodic-table-filter.component';

@Component({
  selector: 'app-table-page',
  standalone: true,
  imports: [
    MatButton,
    PeriodicTableComponent,
    PrerodicTableFilterComponent,
  ],
  templateUrl: './tablePage.component.html',
  styleUrl: './tablePage.component.scss'
})
export class TablePageComponent {

}
