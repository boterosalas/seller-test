import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboPendingProductComponent } from './combo-pending-product.component';
import { MaterialModule } from '@app/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@app/shared/shared.module';
import { MatSnackBarModule, MatSnackBar } from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LoadingService, EndpointService, UserParametersService } from '@app/core';
import { PendingProductsService } from '../pending-products.service';
import { of } from 'rxjs';


const data = {
    sellerId: '11618',
    sellerProfile: 'seller',
    sellerNit: '123',
    sellerName: 'la tienda de cristian 2019 vs 512',
    sellerEmail: 'ccbustamante221@misena.edu.co',
};

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


describe('ComboPendingProductComponent', () => {
    let component: ComboPendingProductComponent;
    let fixture: ComponentFixture<ComboPendingProductComponent>;

    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockPendingProductsService = jasmine.createSpyObj('PendingProductsService', ['getEANProductsModify', 'getEANProductsValidation']);
    const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
    const mockMatSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    beforeEach(async(() => {
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
            ],
            declarations: [ComboPendingProductComponent],
            providers: [
                { provide: LoadingService, useValue: mockLoadingService },
                // { provide: PendingProductsService, useValue: mockPendingProductsService },
                PendingProductsService,
                EndpointService,
                { provide: UserParametersService, useValue: mockUserParameterService },
                { provide: MatSnackBar, useValue: mockMatSnackBar }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComboPendingProductComponent);
        mockUserParameterService.getUserData.and.returnValue(of(data));
        component = fixture.componentInstance;
        // mockPendingProductsService.getEANProductsModify.and.returnValue(of(result));
        // mockPendingProductsService.getEANProductsValidation.and.returnValue(of(result));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('Seteo info', () => {
        const paramsArray = {
            idSeller: 11811,
            ean: 1001114217562,
          };
        component.sellerId = 11811;
        // component.setparams(paramsArray);
        // component.setparams2(paramsArray);
        component.backTolist();
      });
});
