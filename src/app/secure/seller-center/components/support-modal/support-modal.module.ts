/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* our own custom components */
import { SupportModalComponent } from './support-modal.component';
import { MaterialModule } from '../../../../secure/seller-center/components/material-components';
import { SupportService } from './support.service';
import { MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from '../../utils/services/common/user/user.service';
import { EndpointService } from '../../utils/http/endpoint.service';
import { HttpErrorHandlingService } from '../../utils/http/http-error-handling.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        BrowserAnimationsModule
    ],
    declarations: [
        SupportModalComponent
    ],
    exports: [
        SupportModalComponent
    ],
    providers: [
        SupportService,
        UserService,
        EndpointService,
        HttpErrorHandlingService,
        { provide: MatDialogRef, useValue: {} }
    ]
})
export class SupportModule { }