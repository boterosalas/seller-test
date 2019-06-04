import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingMethodsComponent } from './shipping-methods.component';
import { MaterialModule } from '@app/material.module';
import { ShippingMethodsService } from './shipping-methods.service';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    ShippingMethodsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    ShippingMethodsComponent
  ],
  providers: [ShippingMethodsService],
})
export class ShippingMethodsModule { }
