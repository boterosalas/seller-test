import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricalDevolutionComponent } from './historical-devolution-page/historical-devolution.component';
import { HistoricalDevolutionRoutingModule } from './historical-devolution.routing';
import { HistoricalDevolutionService } from './historical-devolution.service';
import { SharedModule } from '@app/shared/shared.module';
import { ViewCommentComponent } from './view-comment/view-comment.component';
import { ToolbarOptionsModule } from '@app/shared/components';
import { HistoricalDevolutionModalComponent } from './historical-devolution-modal/historical-devolution-modal.component';

@NgModule({
  imports: [
    CommonModule,
    HistoricalDevolutionRoutingModule,
    SharedModule,
    ToolbarOptionsModule
  ],
  declarations: [
    HistoricalDevolutionComponent,
    ViewCommentComponent,
    HistoricalDevolutionModalComponent
  ],
  exports: [
    HistoricalDevolutionComponent,
    ViewCommentComponent,
    HistoricalDevolutionModalComponent
  ],
  entryComponents: [
    ViewCommentComponent,
    HistoricalDevolutionModalComponent
  ],
  providers: [
    HistoricalDevolutionService
  ]
})
export class HistoricalDevolutionModule {}
