import {
  ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder, FormControl, FormGroup, ReactiveFormsModule
} from '@angular/forms';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FilterFormEmitterService } from '@periodicTableFeature/services/filter-form-emitter.service';
import {
  debounceTime, distinctUntilChanged, of, switchMap
} from 'rxjs';
import { map } from 'rxjs/operators';

type FilterForm = FormGroup<{ filter: FormControl<string> }>;

@Component({
  selector: 'app-periodic-table-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatIcon,
    MatFabButton,
  ],
  templateUrl: './periodic-table-filter.component.html',
  styleUrl: './periodic-table-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeriodicTableFilterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly filterFormEmitterService = inject(FilterFormEmitterService);
  private readonly destroyRef = inject(DestroyRef);
  protected filterForm!: FilterForm;

  ngOnInit(): void {
    this.initForm();
    this.emitFilterChanges();
  }

  private initForm():void {
    this.filterForm = this.fb.nonNullable.group({
      filter: ''
    });
  }

  private emitFilterChanges() {
    this.filterFormControl.valueChanges.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      map((data) => data.toLowerCase().trim()),
      switchMap((data) => {
        this.filterFormEmitterService.updateData(data);
        return of(data);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  protected submitForm():void {
    const data = this.filterFormControl.value;
    this.filterFormEmitterService.updateData(data);
  }

  protected get filterFormControl(): FormControl<string> {
    return this.filterForm.controls.filter;
  }
}
