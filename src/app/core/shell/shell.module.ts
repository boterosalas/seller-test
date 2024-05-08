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
import { FloatingHeaderComponent } from './floating-header/floating-header.component';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { ProfileStatusComponent } from './profile-status/profile-status.component';


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
    FloatingHeaderComponent,
    ProfileMenuComponent,
    ProfileStatusComponent,
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
