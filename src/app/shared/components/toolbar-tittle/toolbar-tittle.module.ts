import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/material.module';
import { ToolbarTittleComponent } from './toolbar-tittle.component';

@NgModule({
  declarations: [
    ToolbarTittleComponent
  ],
  imports: [
    CommonModule,
    MaterialModule],
  exports: [ToolbarTittleComponent],
  providers: [],
})
export class ToolbarTittleModule { }
