import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTransporterComponent } from './list-transporter.component';
import { ListTransporterService } from './list-transporter.service';

@NgModule({
  declarations: [
    ListTransporterComponent
  ],
  imports: [ CommonModule ],
  exports: [
    ListTransporterComponent
  ],
  providers: [
    ListTransporterService
  ],
})
export class ListTransporterModule {}
