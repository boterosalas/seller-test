import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricalDevolutionComponent } from './historical-devolution-page/historical-devolution.component';
import { HistoricalDevolutionRoutingModule } from './historical-devolution.routing';
import { HistoricalDevolutionService } from './historical-devolution.service';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [CommonModule, HistoricalDevolutionRoutingModule, SharedModule],
  declarations: [HistoricalDevolutionComponent],
  exports: [HistoricalDevolutionComponent],
  providers: [HistoricalDevolutionService]
})
export class HistoricalDevolutionModule {}
