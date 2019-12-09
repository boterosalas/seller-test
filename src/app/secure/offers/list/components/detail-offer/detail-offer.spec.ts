import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { MaterialModule } from '@app/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { LoadingService, ModalService } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { DetailOfferComponent } from './detail-offer.component';
import { ListComponent } from '../../list/list.component';
import { ListService } from '../../list.service';
import { BulkLoadService } from '@app/secure/offers/bulk-load/bulk-load.service';
import { SupportService } from '@app/secure/support-modal/support.service';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';

export const registerRegex = [
    { Identifier: 'formatNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'ofertas' },
    { Identifier: 'promiseDelivery', Value: '(\\d+\\sa\\s\\d+)$', Module: 'ofertas' },
    { Identifier: 'isUpdatedStock', Value: '^([0]|[1])$', Module: 'ofertas' },
];

const detailOffer = [
    {
        'ean': '0001910660339',
        'Stock': 0,
        'Price': 8494,
        'DiscountPrice': 8493,
        'AverageFreightCost': 10000,
        'PromiseDelivery': '1 a 3',
        'IsFreeShipping': 0,
        'IsEnviosExito': 0,
        'IsFreightCalculator': 0,
        'warranty': 3,
        'IsLogisticsExito': 0,
        'Currency': 'COP',
        'imageUrl': null
    }];

describe('Detail offer Component SELLER', () => {

    const mockStoresService = jasmine.createSpyObj('StoresService', ['getAllStoresFull', 'changeStateSeller']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockListService = jasmine.createSpyObj('ListService', ['getOffers']);
    const mockBulkLoadService = jasmine.createSpyObj('BulkLoadService', ['setOffers']);
    const mockSuportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
    const mockMyProfileService = jasmine.createSpyObj('MyProfileService', ['getUser']);

    const formBuilder: FormBuilder = new FormBuilder();

    // Create Variables for services and component
    let fixture: ComponentFixture<DetailOfferComponent>;
    let detailOfferComponent: DetailOfferComponent;
    let bulkLoadService: BulkLoadService;
    let loadingService: LoadingService;
    let supportService: SupportService;


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DetailOfferComponent],
            imports: [
                MaterialModule,
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                SharedModule,
                HttpClientTestingModule,
                TranslateModule.forRoot({})
            ],
            providers: [
                { provide: StoresService, useValue: mockStoresService },
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: AuthService, useValue: mockAuthService },
                { provide: ModalService, useValue: mockDialogError },
                { provide: ListService, useValue: mockListService },
                { provide: BulkLoadService, useValue: mockBulkLoadService },
                { provide: SupportService, useValue: mockSuportService },
                { provide: FormBuilder, useValue: formBuilder },
                { provide: MyProfileService, useValue: mockMyProfileService },
                ListComponent,
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();


    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DetailOfferComponent);
        detailOfferComponent = fixture.componentInstance;
        bulkLoadService = TestBed.get(BulkLoadService);
        loadingService = TestBed.get(LoadingService);
        supportService = TestBed.get(SupportService);
    });

    it('should create detail offer component', () => {
        expect(detailOfferComponent).toBeTruthy();
        expect(bulkLoadService).toBeTruthy();
        expect(loadingService).toBeTruthy();
        expect(supportService).toBeTruthy();
    });

    describe('List with data', () => {
        beforeEach(() => {
            const mockDetailOffer = Object.assign({}, detailOffer);
            const responseRegex = {
                body: {
                    body: JSON.stringify({ Data: registerRegex })
                }
            };
            mockSuportService.getRegexFormSupport.and.returnValue(of(responseRegex));
            const responseGetDetailOffer = {
                body: {
                    body: JSON.stringify({ Data: mockDetailOffer })
                }
            };

            mockListService.getOffers.and.returnValue(of(responseGetDetailOffer));
        });

        it('sould be charge regex', () => {
            expect(!!detailOfferComponent.offertRegex.formatNumber).toBeFalsy();
            expect(!!detailOfferComponent.offertRegex.promiseDelivery).toBeFalsy();
            expect(!!detailOfferComponent.offertRegex.isUpdatedStock).toBeFalsy();
            detailOfferComponent.dataOffer = detailOffer;
            detailOfferComponent.createValidators();
            expect(!detailOfferComponent.offertRegex.formatNumber).toBeTruthy();
            expect(!detailOfferComponent.offertRegex.promiseDelivery).toBeTruthy();
            expect(!detailOfferComponent.offertRegex.isUpdatedStock).toBeTruthy();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });

    });

    describe('inputs edit', () => {
        beforeEach(() => {
            detailOfferComponent.dataOffer = detailOffer;
            detailOfferComponent.dataOffer.availableToOffer = true;
            detailOfferComponent.dataOffer.offerComponents = [
                {
                    ean: '0321321321321',
                    id: 'MK00000006162336',
                    price: '10000',
                    productName: 'product30october',
                    pum: '$10000 por Unidad de product30october',
                    quantity: '1',
                    skuId: 'MK00000006162336',
                }, {
                    ean: 'ABC7573747057914',
                    id: 'MK00000006162261',
                    price: '90000',
                    productName: 'Producto Creado con EAN ABC7573747057914',
                    pum: '$0 por Unidad de Producto Creado con EAN ABC7573747057914',
                    quantity: '1',
                    skuId: 'MK00000006162261',
                }, {
                    ean: '0334589034881',
                    id: 'MK00000006162200',
                    price: '25000',
                    productName: 'Producto Camisa1331',
                    pum: '$0 por Metro de Producto Camisa1331',
                    quantity: '1',
                    skuId: 'MK00000006162200',
                }
            ];
            fixture.detectChanges();
        });

        it('Edit offert', () => {
            detailOfferComponent.editOffer();
            expect(detailOfferComponent.isUpdateOffer).toBeTruthy();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });

});
