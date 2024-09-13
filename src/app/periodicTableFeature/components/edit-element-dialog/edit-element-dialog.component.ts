import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PeriodicTableItem } from '../periodic-table/periodic-table-datasource';

type Form = FormGroup<FormData>;

interface FormData {
  position: FormControl<number> ;
  name: FormControl<string>;
  weight: FormControl<number>;
  symbol: FormControl<string>;
}

@Component({
  selector: 'app-edit-element-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule
  ],
  templateUrl: './edit-element-dialog.component.html',
  styleUrl: './edit-element-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditElementDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<EditElementDialogComponent>);
  protected readonly data: PeriodicTableItem = inject<PeriodicTableItem>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  form: Form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control(this.data.name),
    position: this.fb.nonNullable.control(this.data.position),
    weight: this.fb.nonNullable.control(this.data.weight),
    symbol: this.fb.nonNullable.control(this.data.symbol),
  });

  get controls() {
    return this.form.controls;
  }

  onNoClick() {
    this.dialogRef.close(undefined);
  }

  emitChanges():void {
    const newData: PeriodicTableItem = this.form.getRawValue();
    this.dialogRef.close(newData);
  }
}
