import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { AwsCognitoRoutingModule } from './aws-cognito.routing';
import { JwtComponent } from './jwttokens/jwt.component';
import { SecureHomeComponent } from './landing/securehome.component';
import { MyProfileComponent } from './profile/myprofile.component';
import { UseractivityComponent } from './useractivity/useractivity.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AwsCognitoRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    UseractivityComponent,
    MyProfileComponent,
    SecureHomeComponent,
    JwtComponent
  ],
  exports: [],
  providers: [
    MyProfileComponent
  ],
})
export class AwsCognitoModule {
}
