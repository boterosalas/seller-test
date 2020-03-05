import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalQuotingSellerComponent } from './modal-quoting-seller.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatIconModule, MatSnackBarModule, MatInputModule, MatDialogRef } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '@app/material.module';

export const registerRegex = [
    { Identifier: 'formatNumberInfinito', Value: '^([0-9]+([.][0-9]{2})?)$|^((Infinito|Infinite)$)', Module: 'ofertas' },
    { Identifier: 'priceInfinite', Value: '^[0-9]+$|^((Infinito|Infinite)$)', Module: 'ofertas' },

];

fdescribe('ModalQuotingSellerComponent', () => {
    let component: ModalQuotingSellerComponent;
    let fixture: ComponentFixture<ModalQuotingSellerComponent>;

    const UserInformation = {
        sellerEmail: 'ccbustamante2@misena.edu.co',
        sellerId: '11618',
        sellerName: 'la tienda de cristian 2019 vs 5',
        sellerNit: '1128438122',
        sellerProfile: 'seller',
    };

    const resRegex = {
        body: {
            body: JSON.stringify({ Data: registerRegex })
        }
    };

    const dialogMock = { close: () => { } };
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockUserParametersService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
    const mockShippingMethodsService = jasmine.createSpyObj('ShippingMethodsService', ['getShippingMethods']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockListZonesService = jasmine.createSpyObj('ListZonesService', ['getListZones']);
    const mockListTransporterService = jasmine.createSpyObj('ListTransporterService', ['getListTransporters']);
    const mockQuotingService = jasmine.createSpyObj('QuotingService', ['deleteQuotingSeller']);
    const mockSupportService = jasmine.createSpyObj('SupportService', ['']);
    const mockComponentsService = jasmine.createSpyObj('ComponentsService', ['']);
    const mockTranslateService = jasmine.createSpyObj('TranslateService', ['']);
    const mockSearchService = jasmine.createSpyObj('SearchService', ['']);
    const mockMatSnackBar = jasmine.createSpyObj('MatSnackBar', ['']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalQuotingSellerComponent],
            imports: [
                ReactiveFormsModule,
                FormsModule,
                MatDialogModule,
                HttpClientModule,
                ReactiveFormsModule,
                MatIconModule,
                MatSnackBarModule,
                MatInputModule,
                MaterialModule,
                TranslateModule.forRoot({})
            ],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                TranslateService
                // { provide: LoadingService, useValue: mockLoadingService },
                // { provide: UserParametersService, useValue: mockUserParametersService },
                // { provide: ModalService, useValue: mockDialogError },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalQuotingSellerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component QUOTING SELLER', () => {
        expect(component).toBeTruthy();
    });
});
