import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTransporterComponent } from './list-transporter.component';
import { ListTransporterService } from './list-transporter.service';
import { MaterialModule } from '@app/material.module';
import { CreateDialogModule } from '../dialogs/create/create-dialog.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogModule } from '../dialogs/delete/delete-dialog.module';

@NgModule({
  declarations: [
    ListTransporterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CreateDialogModule,
    MatDialogModule,
    DeleteDialogModule
  ],
  exports: [
    ListTransporterComponent
  ],
  providers: [
    ListTransporterService
  ],
})
export class ListTransporterModule { }
