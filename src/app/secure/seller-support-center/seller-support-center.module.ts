import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerSupportRoutingModule } from './seller-support.routing';
import { TicketDetailModule } from '@app/shared/components/ticket-detail/ticket-detail.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SellerSupportRoutingModule,
    TicketDetailModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  declarations: []
})
export class SellerSupportCenterModule { }
