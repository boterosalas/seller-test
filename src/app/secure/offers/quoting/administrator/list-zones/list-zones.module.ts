import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListZonesService } from './list-zones.service';
import { ListZonesComponent } from './list-zones.component';
import { MaterialModule } from '@app/material.module';

@NgModule({
  declarations: [
    ListZonesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ListZonesComponent
  ],
  providers: [
    ListZonesService
  ],
})
export class ListZonesModule { }
