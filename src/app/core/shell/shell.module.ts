import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';

import { HeaderComponent } from './header/header.component';
import { SearchOrderMenuModule } from './search-order-menu/search-order-menu.module';
import { ShellComponent } from './shell.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToolbarLinkComponent } from './toolbar-link';
import { SupportModalComponent } from '@app/secure/support-modal/support-modal.component';


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
    ToolbarLinkComponent,
    SupportModalComponent
  ],
  exports: [
    HeaderComponent,
    ShellComponent,
    SidebarComponent
  ],
  entryComponents: [
    SupportModalComponent
],
  providers: []
})
export class ShellModule {
}
