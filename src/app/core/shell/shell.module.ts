import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@app/material.module';

import { HeaderComponent } from './header/header.component';
import { LoadingComponent } from './loading/loading.component';
import { ModalComponent } from './modal/modal.component';
import { SearchOrderMenuModule } from './search-order-menu/search-order-menu.module';
import { ShellComponent } from './shell.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        ReactiveFormsModule,
        SearchOrderMenuModule
    ],
    declarations: [
        HeaderComponent,
        ShellComponent,
        SidebarComponent,
        LoadingComponent,
        ModalComponent
    ],
    exports: [
        HeaderComponent,
        ShellComponent,
        SidebarComponent,
        LoadingComponent,
        ModalComponent
    ],
    entryComponents: [
        ModalComponent
    ],
    providers: []
})
export class ShellModule { }
