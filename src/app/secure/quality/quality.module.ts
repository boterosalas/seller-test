import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalificationListComponent } from './calification-list/calification-list.component';
import { QualityRoutingModule } from './quality.routing';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalificationService } from './quality.service';
import { DetailCalificationComponent } from './component/detail-calification/detail-calification.component';
import { ModalConfirmComponent } from './component/modal-confirm/modal-confirm.component';



@NgModule({
  imports: [
    CommonModule,
    QualityRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CalificationListComponent,
     DetailCalificationComponent,
     ModalConfirmComponent
    ],
    providers: [
      CalificationService
  ],
  entryComponents: [
    ModalConfirmComponent
  ],
})
export class QualityModule { }
