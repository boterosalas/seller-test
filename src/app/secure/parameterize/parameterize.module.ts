import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParameterizeRouting } from './parameterize.routing';
import { SpecificationsParamComponent } from './specifications/specifications.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    SpecificationsParamComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ParameterizeRouting
  ],
  exports: [],
  providers: [],
})
export class ParameterizeModule { }
