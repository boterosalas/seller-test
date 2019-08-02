/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OrdersListComponent } from './orders-list.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { OrderService } from '../orders.service';
import { LoadingService, ModalService, EndpointService, UserParametersService, CognitoUtil, UserLoginService, AwsUtil } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '@app/secure/auth/auth.routing';
import { of, throwError } from 'rxjs';
import { SortDirection, MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { AwsCognitoRoutingModule } from '@app/secure/aws-cognito/aws-cognito.routing';
import { SecureHomeComponent } from '@app/secure/aws-cognito/landing/securehome.component';
import { DashboardComponent } from '@app/secure/dashboard/dashboard.component';
import { LogoutComponent } from '@app/public/auth/confirm/confirmRegistration.component';
import { JwtComponent } from '@app/secure/aws-cognito/jwttokens/jwt.component';
import { UseractivityComponent } from '@app/secure/aws-cognito/useractivity/useractivity.component';
import { SidebarComponent } from '@app/core/shell/sidebar/sidebar.component';
import { SearchOrderMenuComponent } from '@app/core/shell/search-order-menu/search-order-menu.component';
import { HeaderComponent } from '@app/core/shell/header/header.component';
import { ToolbarLinkComponent } from '@app/core/shell/toolbar-link';
import { SearchOrderFormComponent } from '@app/core/shell/search-order-menu/search-order-form/search-order-form.component';
import { MyProfileComponent } from '@app/secure/aws-cognito/profile/myprofile.component';
import { StoresService } from '@app/secure/offers/stores/stores.service';

export const registerRegex = [
    { Identifier: 'formatIntegerNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'parametrizacion' },
];

describe('ordersList', () => {
    const registerMenu = {
        Functionalities: [{
            NameFunctionality: 'Crear',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Crear'
        }],
    };

    const userData = { sellerProfile: 'seller' };
    const order = {
        id: 10000,
        processedOrder: false,
        allowShipping: false,
        sendAllProduct: false,
        orderNumber: '10000',
        idSeller: 1000,
        nameSeller: 'test_seller',
        nitSeller: '10002563',
        idChannel: 12332,
        channel: 'test_canal',
        dateOrder: '19011990',
        idStatusOrder: 2,
        statusOrder: '200',
        costTotalOrder: 200000,
        costTotalShipping: 20000,
        commission: 20000,
        dateMaxDeliveryOrder: '19012019',
        typeDespatchOrder: 'test_type_despatch',
        identificationCard: 'test_identification',
        clientName: 'test_client',
        clientTelephone: '30536985526',
        clientAddress: 'test_address',
        products: [
            {
                idDetailProduct: 10000,
                idPicking: 1000,
                id: 100,
                nameProduct: 'test_nameProduct',
                productId: '10025',
                sku: 10025,
                ean: '10002566323',
                checkProductToSend: false,
                reference: 'test_reference',
                idStatusProduct: 2,
                statusProduct: 'test_status',
                quantity: 30,
                costProduct: 30000,
                costShippingProduct: 30000,
                commission: 30000,
                dateMaxDeliveryProduct: '19011990',
                typeDespatchProduct: 'test_typedespatch',
                tracking: 'test_tracking',
                carrier: 'carrier_test',
                dateDelivery: '19011990',
                enviosExito: false,
                fulfillment: false
            },

        ]
    };

    // const dataSourceData = new MatTableDataSource({
    //     id: 636996824890656701,
    //     processedOrder: false,
    //     allowShipping: true,
    //     sendAllProduct: false,
    //     idSeller: 0,
    //     idChannel: 11,
    //     costTotalOrder: 14,
    //     costTotalShipping: 23,
    //     dateOrder: '2019-07-25T14:51:16.01+00:00',
    //     idStatusOrder: 35,
    //     dateMaxDeliveryOrder: '2019-07-25T14:51:28.07+00:00',
    //     commission: 0
    // };

    const mockOrderService = jasmine.createSpyObj('OrderService', ['getOrderList', 'getOrdersFilter', 'sendProductOrder', 'sendAllProductInOrder', 'getCarries', 'recordProcesSedOrder', 'getCurrentFilterOrders', 'setCurrentFilterOrders']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu', 'getMenuProfiel']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
    const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData', 'clearUserData', 'getParameters', 'getAttributes', 'getSession']);
    const data = {
        title: '',
        message: '',
        icon: '',
        form: null,
        btnConfirmationText: null,
        showButtons: false
    };

    // Create Variables for services and component
    let fixture: ComponentFixture<OrdersListComponent>;
    let orderComponent: OrdersListComponent;
    let orderService: OrderService;
    let dialogFixture: ComponentFixture<DialogWithFormComponent>;
    let dialogComponent: DialogWithFormComponent;
    let supportService: SupportService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                SharedModule,
                AwsCognitoRoutingModule,
                ReactiveFormsModule,
                MaterialModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                FormsModule
            ],
            declarations: [
                OrdersListComponent,
                MyProfileComponent,
                ShellComponent,
                SecureHomeComponent,
                DashboardComponent,
                LogoutComponent,
                JwtComponent,
                UseractivityComponent,
                SidebarComponent,
                SearchOrderMenuComponent,
                HeaderComponent,
                ToolbarLinkComponent,
                SearchOrderFormComponent,
            ],
            providers: [
                { provide: OrderService, useValue: mockOrderService },
                EndpointService,
                { provide: LoadingService, useValue: mockLoadingService },
                // { provide: SupportService, useValue: mockSupportService },
                SupportService,
                { provide: AuthService, useValue: mockAuthService },
                UserParametersService,
                CognitoUtil,
                { provide: UserLoginService, useValue: mockUserLoginService },
                { provide: ModalService, useValue: mockDialogError },
                { provide: MatDialog, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: UserParametersService, useValue: mockUserParameterService },
                ShellComponent,
                ComponentsService,
                EventEmitterOrders,
                AwsUtil,
                StoresService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [DialogWithFormComponent]
            }
        });
    }));

    beforeEach(() => {
        mockAuthService.getMenu.and.returnValue(registerMenu);
        mockAuthService.getMenuProfiel.and.returnValue(registerMenu);
        fixture = TestBed.createComponent(OrdersListComponent);
        orderComponent = fixture.componentInstance;
        orderService = TestBed.get(OrderService);
        supportService = TestBed.get(SupportService);
        dialogFixture = TestBed.createComponent(DialogWithFormComponent);
        dialogComponent = dialogFixture.componentInstance;
        mockSupportService.getRegexFormSupport.and.returnValue(of(registerRegex));
        // mockOrderService.getOrderList.and.returnValue(of(response));
        const mockUser = Object.assign({}, userData);
        const responseGetUser = {
            body: {
                body: JSON.stringify({ Data: mockUser })
            }
        };
        mockUserParameterService.getUserData.and.returnValue(of(responseGetUser));
        fixture.detectChanges();
    });

    it('', () => {
        expect(orderService).toBeTruthy();
        expect(orderComponent).toBeTruthy();
    });
    it('', () => {
        orderComponent.dataSource = new MatTableDataSource();
        orderComponent.applyFilter('123366523');
    });
    it('', () => {
        orderComponent.stopPropagation(new Event('change'));
    });
    it('', () => {
        orderComponent.getDateWithOutGMT(19011990);
    });
    it('', () => {
        orderComponent.dataSource = new MatTableDataSource();
        orderComponent.isAllSelected();
    });

    afterAll(() => {
        TestBed.resetTestingModule();
    });
    afterAll(() => {
        TestBed.resetTestingModule();
    });
});
