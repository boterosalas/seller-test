import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTransporterComponent } from './list-transporter.component';
import { ListTransporterService } from './list-transporter.service';
import { MaterialModule } from '@app/material.module';
import { CreateDialogModule } from '../dialogs/create/create-dialog.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogModule } from '../dialogs/delete/delete-dialog.module';
import { SellerModule } from '@app/secure/seller/seller.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  declarations: [
    ListTransporterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CreateDialogModule,
    MatDialogModule,
    DeleteDialogModule,
    SellerModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    ListTransporterComponent
  ],
  providers: [
    ListTransporterService
  ],
})
export class ListTransporterModule { }
