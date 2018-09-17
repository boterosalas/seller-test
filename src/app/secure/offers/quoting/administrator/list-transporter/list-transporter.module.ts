import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTransporterComponent } from './list-transporter.component';
import { ListTransporterService } from './list-transporter.service';
import { MaterialModule } from '@app/material.module';
import { CreateDialogComponent } from '../dialogs/create/create-dialog.component';

@NgModule({
  declarations: [
    ListTransporterComponent,
    CreateDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  entryComponents: [
    CreateDialogComponent
  ],
  exports: [
    ListTransporterComponent
  ],
  providers: [
    ListTransporterService
  ],
})
export class ListTransporterModule { }
