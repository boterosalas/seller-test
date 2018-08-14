import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@app/material.module';
import { DynamoDBService, UserLoginService } from '@shared/services';

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
    providers: [
        DynamoDBService,
        UserLoginService
    ]
})
export class ToolbarLinkModule { }
