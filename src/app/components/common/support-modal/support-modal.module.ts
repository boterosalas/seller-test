/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* our own custom components */
import { SupportModalComponent } from './support-modal.component';
import { MaterialModule } from '../../../core/components/material-components';
import { SupportService } from './support.service';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../core/services/common/user/user.service';
import { HttpErrorHandlingService } from '../../../core/http/http-error-handling.service';
import { EndpointService } from '../../../core/http/endpoint.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
