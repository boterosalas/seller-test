import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingMethodsComponent } from './shipping-methods.component';
import { MaterialModule } from '@app/material.module';
import { ShippingMethodsService } from './shipping-methods.service';

@NgModule({
  declarations: [
    ShippingMethodsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ShippingMethodsComponent
  ],
  providers: [ShippingMethodsService],
})
export class ShippingMethodsModule { }
