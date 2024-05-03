import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';

import { HeaderComponent } from './header/header.component';
import { SearchOrderMenuModule } from './search-order-menu/search-order-menu.module';
import { ShellComponent } from './shell.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SupportModule } from '@app/secure/support-modal/support-modal.module';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    SearchOrderMenuModule,
    SupportModule
  ],
  declarations: [
    HeaderComponent,
    ShellComponent,
    SidebarComponent,
  ],
  exports: [
    HeaderComponent,
    ShellComponent,
    SidebarComponent
  ],
  entryComponents: [
],
  providers: []
})
export class ShellModule {
}
