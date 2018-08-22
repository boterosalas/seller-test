import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AwsCognitoRoutingModule } from './aws-cognito.routing';
import { JwtComponent } from './jwttokens/jwt.component';
import { SecureHomeComponent } from './landing/securehome.component';
import { MyProfileComponent } from './profile/myprofile.component';
import { UseractivityComponent } from './useractivity/useractivity.component';

@NgModule({
    declarations: [
        UseractivityComponent,
        MyProfileComponent,
        SecureHomeComponent,
        JwtComponent,
    ],
    imports: [
        CommonModule,
        AwsCognitoRoutingModule
    ],
    exports: [],
    providers: [
        MyProfileComponent
    ],
})
export class AwsCognitoModule { }
