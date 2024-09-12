import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder, FormControl, FormGroup, ReactiveFormsModule
} from '@angular/forms';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  debounceTime, distinctUntilChanged, of, switchMap
} from 'rxjs';
import { map } from 'rxjs/operators';

import { FilterFormEmitterService } from '../../services/filter-form-emitter.service';

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
  styleUrl: './periodic-table-filter.component.scss'
})
export class PeriodicTableFilterComponent implements OnInit {
  constructor(
    private readonly fb:FormBuilder,
    private readonly filterFormEmitterService: FilterFormEmitterService,
    private readonly destroyRef:DestroyRef
  ) { }

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
