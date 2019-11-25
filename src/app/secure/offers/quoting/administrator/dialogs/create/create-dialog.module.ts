import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDialogComponent } from './create-dialog.component';
import { MaterialModule } from '@app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateDialogService } from './create-dialog.service';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    CreateDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    SharedModule
  ],
  exports: [
    CreateDialogComponent
  ],
  providers: [
    CreateDialogService
  ],
})
export class CreateDialogModule { }
