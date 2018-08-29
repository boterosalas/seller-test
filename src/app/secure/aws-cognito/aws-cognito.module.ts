import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseractivityComponent } from './useractivity/useractivity.component';
import { MyProfileComponent } from './profile/myprofile.component';
import { SecureHomeComponent } from './landing/securehome.component';
import { JwtComponent } from './jwttokens/jwt.component';
import { AwsCognitoRoutingModule } from './aws-cognito.routing';

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
