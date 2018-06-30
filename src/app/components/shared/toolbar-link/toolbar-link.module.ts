/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

/* our own custom components */
import { MaterialModule } from '../../../core/components/material-components';
import { ToolbarLinkComponent } from './toolbar-link.component';
import { RouterModule } from '@angular/router';

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
    providers: [
    ]
})
export class ToolbarLinkModule { }
