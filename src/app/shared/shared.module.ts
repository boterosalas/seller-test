import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToolbarLinkModule } from '@app/shared/components/toolbar-link/toolbar-link.module';
import { ToolbarOptionsModule } from '@app/shared/components/toolbar-options/toolbar-options.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ToolbarLinkModule,
    ToolbarOptionsModule
  ],
  providers: [],
  exports: []
})
export class SharedModule { }
