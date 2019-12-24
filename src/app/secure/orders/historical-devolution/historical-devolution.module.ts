import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricalDevolutionComponent } from './historical-devolution-page/historical-devolution.component';
import { HistoricalDevolutionRoutingModule } from './historical-devolution.routing';
// import { HistoricalDevolutionService } from './historical-devolution.service';

@NgModule({
    imports: [CommonModule, HistoricalDevolutionRoutingModule],
    declarations: [HistoricalDevolutionComponent],
    exports: [HistoricalDevolutionComponent],
    providers: []
})
export class HistoricalDevolutionModule {}
