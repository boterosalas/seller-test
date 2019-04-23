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

describe('Detail offer Component', () => {

    const mockStoresService = jasmine.createSpyObj('StoresService', ['getAllStoresFull', 'changeStateSeller']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockListService = jasmine.createSpyObj('ListService', ['getOffers']);
    const mockBulkLoadService = jasmine.createSpyObj('BulkLoadService', ['setOffers']);
    const mockSuportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
    const formBuilder: FormBuilder = new FormBuilder();

    // Create Variables for services and component
    let fixture: ComponentFixture<DetailOfferComponent>;
    let detailOfferComponent: DetailOfferComponent;
    let bulkLoadService: BulkLoadService;
    let loadingService: LoadingService;
    let supportService: SupportService;


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DetailOfferComponent, DialogWithFormComponent],
            imports: [
                MaterialModule,
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule,
                BrowserAnimationsModule
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
                ListComponent
            ]
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

    });

    describe('inputs edit', () => {
        beforeEach(() => {
            detailOfferComponent.dataOffer = detailOffer;
            detailOfferComponent.editOffer();
            fixture.detectChanges();
        });

        it('Should be pass stock with letter', () => {
            fixture.whenStable().then(() => {
                const stockField = fixture.debugElement.query(By.css('#detail-offer-stock'));
                expect(stockField).toBeTruthy();
                const stockNativeElement = stockField.nativeElement;
                stockNativeElement.value = 'asddfgghj';
                stockNativeElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                expect(detailOfferComponent.Stock.errors).toBeNull();
            });
        });
        it('Should be pass stock with in blank', () => {
            fixture.whenStable().then(() => {
                const stockField = fixture.debugElement.query(By.css('#detail-offer-stock'));
                expect(stockField).toBeTruthy();
                const stockNativeElement = stockField.nativeElement;
                stockNativeElement.value = ' ';
                stockNativeElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                expect(detailOfferComponent.Stock.errors).toBeNull();
            });
        });
        it('Should be pass price with letter', () => {
            fixture.whenStable().then(() => {
                const priceField = fixture.debugElement.query(By.css('#detail-offer-Price'));
                expect(priceField).toBeTruthy();
                const stockNativeElement = priceField.nativeElement;
                stockNativeElement.value = 'asdasdasdasd';
                stockNativeElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                expect(detailOfferComponent.Stock.errors).toBeNull();
            });
        });
        it('Should be pass price > 8000', () => {
            fixture.whenStable().then(() => {
                const priceField = fixture.debugElement.query(By.css('#detail-offer-Price'));
                expect(priceField).toBeTruthy();
                const stockNativeElement = priceField.nativeElement;
                stockNativeElement.value = '9000';
                stockNativeElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                expect(detailOfferComponent.Price.errors).toBeNull();
            });
        });

        it('should be fail price required', () => {
            fixture.whenStable().then(() => {
                const priceField = fixture.debugElement.query(By.css('#detail-offer-Price'));
                expect(priceField).toBeTruthy();
                const priceNativeElement = priceField.nativeElement;
                priceNativeElement.value = 'fghfghfghfghfg';
                priceNativeElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                expect(detailOfferComponent.Price.errors).toBeNull();
            });
        });

    });

});
