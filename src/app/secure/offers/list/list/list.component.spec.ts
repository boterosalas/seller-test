import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';


import { MaterialModule } from '@app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@app/shared/shared.module';
import { SortDirection, MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EndpointService, LoadingService, ModalService } from '@app/core';
import { ListComponent } from './list.component';
import { ListService } from '../list.service';
import { AuthService } from '@app/secure/auth/auth.routing';
import { BulkLoadService } from '../../bulk-load/bulk-load.service';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

const result = {
    body: {
        errors: [],
        data: {
            sellerOfferViewModels: [{
                availableToOffer: true,
                currency: 'COP',
                discountPrice: '50000000.00',
                ean: '0334589034884',
                hexColourCodePDP: '',
                idOffer: '637126879799933552',
                idSeller: 11618,
                imageUrl: 'https://s3.amazonaws.com/seller.center.exito.images/imagesDev/products/366/PMK0000006147366/MK00000006147366_bg_a.jpg',
                isEnviosExito: true,
                isFreeShipping: false,
                isFreightCalculator: false,
                isLogisticsExito: false,
                isProcessed: true,
                isUpdatedStock: true,
                lastUpdate: '2019-12-27T14:44:58.2310196Z',
                name: 'Producto Camisa1335',
                nit: '1128438122',
                offerComponents: [],
                periodicity: 1,
                pluVtex: '100239730',
                price: '60000000.00',
                promiseDelivery: '3 a 6',
                sellerSku: null,
                sellerSkuParent: null,
                shippingCost: '10000.00',
                size: '',
                sku: null,
                stock: 0,
                warranty: 2
            }],
            total: 3446
        },
        message: ''
    }
};

const resStatus = {
    body: {
        errors: [],
        data: {
            checked: 'True',
            idSeller: 11618,
            response: {
                Message: 'Operación realizada con éxito.',
                Errors: [],
                Data: {
                    TotalProcess: 3442,
                    Error: 0,
                    Successful: 3442,
                    OfferNotify: []
                }
            },
            status: 2
        },
        message: ''
    }
};


describe('ListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;

    const mockModalService = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockListService = jasmine.createSpyObj('ListService', ['getOffers', 'desactiveMassiveOffers']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
    const mockBulkLoadService = jasmine.createSpyObj('BulkLoadService', ['verifyStatusBulkLoad']);

    const registerMenu = {
        Functionalities: [{
            NameFunctionality: 'Crear',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Crear'
        }],
    };


    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                HttpClientModule,
                SharedModule,
                MatSnackBarModule,
                CommonModule
            ],
            declarations: [ListComponent],
            providers: [
                LoadingService,
                { provide: ModalService, useValue: mockModalService },
                { provide: ListService, useValue: mockListService },
                { provide: AuthService, useValue: mockAuthService },
                { provide: BulkLoadService, useValue: mockBulkLoadService },

            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        mockAuthService.getMenu.and.returnValue(registerMenu);
        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
        mockListService.getOffers.and.returnValue(of(result));
        mockBulkLoadService.verifyStatusBulkLoad.and.returnValue(of(resStatus));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});


