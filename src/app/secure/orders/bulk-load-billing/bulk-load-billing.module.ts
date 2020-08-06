import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { BulkLoadBillingComponent } from './bulk-load-billing.component';
import { BulkLoadBillingRoutingModule } from './bulk-load-billing.routing';
import { BulkLoadBillingService } from './bulk-load-billing.service';
import { ngfModule } from 'angular-file';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BulkLoadBillingRoutingModule,
    MatToolbarModule,
    MaterialModule,
    SharedModule,
    ngfModule
  ],
  declarations: [
    BulkLoadBillingComponent,
  ],
  exports: [
    BulkLoadBillingComponent,
  ],
  entryComponents: [
    BulkLoadBillingComponent
  ],
  providers: [
    BulkLoadBillingService,
  ]
})
export class BulkLoadBillingModule { }
