import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '@app/material.module';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ToolbarLinkModule } from '@shared/components/toolbar-link';
import { ToolbarOptionsModule } from '@shared/components/toolbar-options';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    LoadingComponent
  ],
  exports: [
    MaterialModule,
    ToolbarLinkModule,
    ToolbarOptionsModule,
    LoadingComponent
  ],
  providers: []
})
export class SharedModule {
}
