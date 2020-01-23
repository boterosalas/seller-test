import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalificationListComponent } from './calification-list/calification-list.component';
import { CalificationRoutingModule } from './calification.routing';
import { SharedModule } from '@app/shared/shared.module';
import { FilterComponent } from './component/filter/filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [
    CommonModule,
    CalificationRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [CalificationListComponent, FilterComponent]
})
export class CalificationsModule { }
