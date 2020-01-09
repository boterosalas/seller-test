import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitiesCoverageRoutingModule } from './cities-coverage.routing';
import { CitiesCoverageComponent } from './cities-coverage-page/cities-coverage.component';
import { CitiesCoverageService } from './cities-coverage.service';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CitiesCoverageRoutingModule,
    SharedModule
  ],
  declarations: [
    CitiesCoverageComponent
  ],
  exports: [
    CitiesCoverageComponent
  ],
  providers: [
    CitiesCoverageService
  ]
})
export class CitiesCoverageModule { }
