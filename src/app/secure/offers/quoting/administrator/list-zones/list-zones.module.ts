import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListZonesService } from './list-zones.service';
import { ListZonesComponent } from './list-zones.component';
import { MaterialModule } from '@app/material.module';
import { CreateDialogModule } from '../dialogs/create/create-dialog.module';
import { DeleteDialogModule } from '../dialogs/delete/delete-dialog.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ListZonesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CreateDialogModule,
    DeleteDialogModule,
    MatDialogModule,
  ],
  exports: [
    ListZonesComponent
  ],
  providers: [
    ListZonesService
  ],
})
export class ListZonesModule { }
