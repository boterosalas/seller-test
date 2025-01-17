import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { SellerListComponent } from './list/list-sellers.component';
import { SellerRoutingModule } from './seller.routing';
import { SellerService } from './seller.service';
import { StoresService } from '../offers/stores/stores.service';
import { MatSidenav, MatSidenavModule } from '@angular/material';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { SharedModule } from '@app/shared/shared.module';
import { CoreModule } from '@angular/flex-layout';
import { UploadAgreementComponent } from './upload-agreement/upload-agreement.component';
import { ModalLoadAgreementComponent } from './modal-load-agreement/modal-load-agreement.component';
import { ngfModule } from 'angular-file/file-upload/ngf.module';
import { TermsComponent } from './agreement/terms/terms.component';
import { ManageAgreementComponent } from './manage-agreement/manage-agreement.component';
import { ModalBulkloadAgreementComponent } from './manage-agreement/modal-bulkload-agreement/modal-bulkload-agreement.component';
import { ModalDeleteAgreementComponent } from './manage-agreement/modal-delete-agreement/modal-delete-agreement.component';
import { DetailAgreementComponent } from './manage-agreement/detail-agreement/detail-agreement.component';


@NgModule({
    declarations: [
        SellerListComponent,
        UploadAgreementComponent,
        ModalLoadAgreementComponent,
        ManageAgreementComponent,
        ModalBulkloadAgreementComponent,
        ModalDeleteAgreementComponent,
        DetailAgreementComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MaterialModule,
        SellerRoutingModule,
        MatSidenavModule,
        SharedModule,
        ngfModule
    ],
    exports: [
    ],
    entryComponents: [
        ModalLoadAgreementComponent,
        ModalBulkloadAgreementComponent,
        ModalDeleteAgreementComponent
    ],
    providers: [
        SellerService,
        StoresService,
        ModalLoadAgreementComponent,
        ModalBulkloadAgreementComponent,
        ModalDeleteAgreementComponent,
        TermsComponent
    ],
})
export class SellerModule { }
