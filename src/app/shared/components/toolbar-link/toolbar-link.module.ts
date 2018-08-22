import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@app/material.module';

import { ToolbarLinkComponent } from './toolbar-link.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    declarations: [
        ToolbarLinkComponent
    ],
    exports: [
        ToolbarLinkComponent
    ],
    providers: []
})
export class ToolbarLinkModule { }
