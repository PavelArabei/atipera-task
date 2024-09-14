import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { PeriodicTableComponent } from '../../components/periodic-table/periodic-table.component';
import { PeriodicTableFilterComponent } from '../../components/periodic-table-filter/periodic-table-filter.component';
import { FilterFormEmitterService } from '../../services/filter-form-emitter.service';

@Component({
  selector: 'app-table-page',
  standalone: true,
  imports: [
    MatButton,
    PeriodicTableFilterComponent,
    PeriodicTableComponent,
    MatProgressSpinner,
  ],
  templateUrl: './tablePage.component.html',
  styleUrl: './tablePage.component.scss',
  providers: [FilterFormEmitterService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablePageComponent {

}
