import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';

import { HeaderComponent } from './header/header.component';
import { ModalComponent } from './modal/modal.component';
import { SearchOrderMenuModule } from './search-order-menu/search-order-menu.module';
import { ShellComponent } from './shell.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    SearchOrderMenuModule
  ],
  declarations: [
    HeaderComponent,
    ShellComponent,
    SidebarComponent,
    ModalComponent
  ],
  exports: [
    HeaderComponent,
    ShellComponent,
    SidebarComponent,
    ModalComponent
  ],
  entryComponents: [
    ModalComponent
  ],
  providers: []
})
export class ShellModule {
}
