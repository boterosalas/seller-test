import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDialogComponent } from './create-dialog.component';
import { MaterialModule } from '@app/material.module';

@NgModule({
  declarations: [
    CreateDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    CreateDialogComponent
  ],
  providers: [],
})
export class CreateDialogModule { }
