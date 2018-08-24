import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '@app/material.module';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ToolbarLinkModule } from '@shared/components/toolbar-link/toolbar-link.module';
import { ToolbarOptionsModule } from '@shared/components/toolbar-options/toolbar-options.module';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ToolbarLinkModule,
    ToolbarOptionsModule,
  ],
  declarations: [
    LoadingComponent
  ],
  exports: [
    LoadingComponent
  ],
  providers: []
})
export class SharedModule {
}
