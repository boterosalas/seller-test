import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitiesCoverageRoutingModule } from './cities-coverage.routing';
import { CitiesCoverageComponent } from './cities-coverage-page/cities-coverage.component';
import { CitiesCoverageService } from './cities-coverage.service';
import { SharedModule } from '@app/shared/shared.module';
import { StatesService } from '@app/shared/components/states/states.service';
import { CitiesServices } from '@app/shared/components/cities/cities.service';

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
    CitiesCoverageService,
    StatesService,
    CitiesServices
  ]
})
export class CitiesCoverageModule { }
