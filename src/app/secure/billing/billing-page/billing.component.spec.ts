/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { BillingModule } from '../billing.module';
import { BillingComponent } from './billing.component';
import { ShellComponent } from '@app/core/shell';
import { MatSidenavModule } from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingService } from '../billing.service';
import { EndpointService, UserLoginService, DynamoDBService, UserParametersService, LoadingService } from '@app/core';
import { of } from 'rxjs';
import { DownloadBillingpayModalComponent } from '../download-billingpay-modal/download-billingpay-modal.component';


describe('BillingComponent', () => {
    let component: BillingComponent;
    let fixture: ComponentFixture<BillingComponent>;
    const userData = {sellerProfile: 'seller'}; 

   // Mock Services 
   const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']); 
   const mockBillingService = jasmine.createSpyObj('BillingService', ['getBilling']);
   const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']); 
   const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);

    const responseGetBilling = {
        billingNumber: "9406165195",
        billingTotal: 95925,
        commission: 8975,
        concept: "Venta Marketplace",
        detail: [{
            commission: 8975,
            detailName: "Videojuego Grand Theft Auto V PS4",
            ean: "MP02080000000035",
            enviosExito: false,
            id: 636863783488493700,
            idBillingDetailPicking: 1036,
            price: 104900,
            quantity: 1,
            shippingCost: 1557,
            totalShippingCost: 1557,
        }],
        fulfillmentDetail: null,
        id: 636863783488493600,
        idBillingPicking: 1009,
        idSeller: 11618,
        iva: -1705.25,
        orderNumber: "704359035",
        paginationToken: "636863783488493620|11618",
        payOrderNumber: "6200006051",
        paymentDate: "2019-02-08T16:44:04.677+00:00"
    };

    const userInfo = {
        sellerId: '11618',
        sellerProfile: 'seller',
        sellerName: 'Cristian',
        sellerNit: '12345678-9',
        sellerEmail: 'prueba@hotmail.com'
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                BillingModule,
                MatSidenavModule,
                CommonModule,
                FormsModule
            ],
            declarations: [
                ShellComponent
            ],
            providers: [
                { provide: BillingService, useValue: mockBillingService },
                EndpointService,
                DatePipe,
                { provide: UserLoginService, useValue: mockUserLoginService },
                DynamoDBService,
                { provide: UserParametersService, useValue: mockUserParameterService },
                {provide: LoadingService, useValue: mockLoadingService},
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
        const mockUser = Object.assign({}, userData);
        const responseGetUser = { 
          body: { 
            body: JSON.stringify({ Data: mockUser }) 
          } 
        }; 
        // Define la respuesta de la información de un pagos
        mockUserParameterService.getUserData.and.returnValue(of(responseGetUser)); 
        mockUserLoginService.isAuthenticated.and.returnValue(true); 
        mockBillingService.getBilling.and.returnValue(of(responseGetBilling));

    }));

    beforeEach(async () => {
        fixture = TestBed.createComponent(BillingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await component.isLoggedIn('', true);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('response getBilling', () => {
        // component.getOrdersList(event);
        expect(mockBillingService.getBilling).toHaveBeenCalled();
    });

});
