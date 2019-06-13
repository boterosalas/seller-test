import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/material.module';
import { TicketDetailComponent } from './ticket-detail.component';
import { TicketModalComponent } from '@app/secure/seller-support-center/ticket-modal/ticket-modal.component';
import { TicketToolbarComponent } from '@app/secure/seller-support-center/ticket-toolbar/ticket-toolbar.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    TicketDetailComponent,
    TicketModalComponent,
    TicketToolbarComponent],
  entryComponents: [TicketModalComponent],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class TicketDetailModule { }
