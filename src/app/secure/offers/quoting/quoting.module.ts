import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotingComponent } from './quoting.component';
import { QuotingAdministratorModule } from './administrator/quoting-administrator.module';
import { QuotingSellerModule } from './seller/quoting-seller.module';
import { QuotingRoutingModule } from './quoting.routing';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    QuotingComponent
  ],
  imports: [
    CommonModule,
    QuotingRoutingModule,
    QuotingAdministratorModule,
    QuotingSellerModule,
    SharedModule
  ],
  exports: [],
  providers: [],
})
export class QuotingModule { }
