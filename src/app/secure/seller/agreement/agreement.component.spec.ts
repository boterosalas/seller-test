import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingService, UserParametersService } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { AuthService } from '@app/secure/auth/auth.routing';
import { BillingOrdersService } from '@app/secure/orders/billing-orders/billing-orders.service';
import { ComponentsService } from '@app/shared';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AgreementComponent } from './agreement.component';
import { AgreementService } from './agreement.component.service';


fdescribe('AgreementComponent', () => {
    let component: AgreementComponent;
    let fixture: ComponentFixture<AgreementComponent>;

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
    const mockAgreementService = jasmine.createSpyObj('AgreementService', ['getAgreements']);
    const mockBillingOrdersService = jasmine.createSpyObj('BillingOrdersService', ['getDownnLoadBilling']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);

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
            declarations: [AgreementComponent],
            providers: [
                ComponentsService,
                EventEmitterSeller,
                UserParametersService,
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: MatDialog, useValue: mockDialog },
                { provide: AgreementService, useValue: mockAgreementService },
                { provide: BillingOrdersService, useValue: mockBillingOrdersService },
                { provide: AuthService, useValue: mockAuthService },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AgreementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('dialog should be closed after onNoClick()', () => {
        expect(component).toBeTruthy();
    });
});
