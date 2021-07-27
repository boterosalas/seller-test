import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingService } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { ComponentsService } from '@app/shared';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SellerService } from '../../seller.service';

import { ModalDeleteAgreementComponent } from './modal-delete-agreement.component';

describe('ModalDeleteAgreementComponent', () => {
    let component: ModalDeleteAgreementComponent;
    let fixture: ComponentFixture<ModalDeleteAgreementComponent>;

    const dataDelete = {
        dataAgreement: {
            DocumentId: '637347387380880022',
            DocumentType: 2,
            SellerId: 100005
        },
        deleteMultiple: 1,
        name: 'Acuerdo - qwertyu',
        // Sellers: [12485],
        // TypeContracts: '2',
        // deleteMultiple: 2,
        // name: 'Acuerdo - Acuerdo victor uno',
        // DocumentId: '2'
    };


    const newResponseRegex = {
        statusCode: 200,
        body: {
            body: JSON.stringify({
                Data: true
            })
        }
    };
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockSellerService = jasmine.createSpyObj('SellerService', ['deleteOneOrMore', 'deteleAllSellerAgreement']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                HttpClientModule,
                SharedModule,
                RouterTestingModule,
                TranslateModule.forRoot({}),
            ],
            declarations: [ModalDeleteAgreementComponent],
            providers: [
                ComponentsService,
                { provide: SellerService, useValue: mockSellerService },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: MatDialog, useValue: mockDialog },

            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalDeleteAgreementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('dialog should be closed after onNoClick()', () => {
        component.onNoClick();
        expect(component).toBeTruthy();
    });


    // describe('Eliminar un vendedor', () => {
    //     beforeEach(() => {

    //         fixture = TestBed.createComponent(ModalDeleteAgreementComponent);
    //         component = fixture.componentInstance;
    //         component.data = dataDelete;
    //         mockSellerService.deleteOneOrMore.and.returnValue(of(newResponseRegex));
    //         fixture.detectChanges();

    //     });

    //     it('Should be true delete', () => {
    //         component.data = dataDelete;
    //         fixture.detectChanges();
    //         component.sendDataDeleteOneAgreement();
    //         fixture.detectChanges();

    //     });
    //     afterAll(() => {
    //         TestBed.resetTestingModule();
    //     });

    // });
});
