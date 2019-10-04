// /* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LoadingService, ModalService, EndpointService, UserParametersService, CognitoUtil, UserLoginService, DynamoDBService, AwsUtil } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '@app/secure/auth/auth.routing';
import { of, throwError } from 'rxjs';
import { SortDirection, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentsService, RoutesConst, EventEmitterOrders } from '@app/shared';
/* our own custom components */
import { ProductsOrderComponent } from './products-order.component';
import { OrdersModule } from '../orders.module';
import { OrdersListComponent } from '../orders-page/orders-list.component';
import { ShellComponent } from '@app/core/shell';
import { OrderService } from '../orders.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { AuthRoutingService } from '@app/secure/auth/auth.service';

const dataSource = {
  data: [{ orderNumber: '3', products: [{ checkProductToSend: true }, { checkProductToSend: false }], sendAllProduct: false },
  { orderNumber: '4', products: [{ checkProductToSend: false }, { checkProductToSend: false }], sendAllProduct: false },
  { rderNumber: '5', products: [{ checkProductToSend: false }, { checkProductToSend: false }], sendAllProduct: false }]
};

const data = {
  id: 636979560820957673,
  processedOrder: false,
  allowShipping: true,
  sendAllProduct: false,
  orderNumber: '3',
  idSeller: 11618,
  nameSeller: 'la tienda de cristian 2019 vs 5',
  nitSeller: '300169081',
  idChannel: 11,
  channel: 'Exito.com',
  dateOrder: '2019-07-05T11:18:14.387+00:00',
  idStatusOrder: 35,
  statusOrder: 'Asignado',
  costTotalOrder: 9000,
  costTotalShipping: 20000,
  commission: 0,
  dateMaxDeliveryOrder: '2019-07-19T00:00:00+00:00',
  typeDespatchOrder: 'Standar  ',
  identificationCard: '1017142034',
  clientName: 'Leo',
  clientTelephone: '2222222',
  clientAddress: 'cra 1 n 1-1, MEDELLIN, ANTIOQUIA, Colombia',
  products: []
};


describe('ProductsOrderComponent', () => {
  let component: ProductsOrderComponent;
  let fixture: ComponentFixture<ProductsOrderComponent>;

  const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
  const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
  const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
  const mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport', 'sendSupportMessage']);
  const mockComponentsService = jasmine.createSpyObj('ComponentsService', ['openConfirmAlert', 'openSnackBar']);
  // const mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant', 'stream']);

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
        TranslateModule.forRoot({})
      ],
      declarations: [
        ProductsOrderComponent,
      ],
      providers: [
        OrdersListComponent,
        ShellComponent,
        ComponentsService,
        EventEmitterOrders,
        DynamoDBService,
        CognitoUtil,
        EndpointService,
        UserParametersService,
        OrderService,
        AwsUtil,
        AuthRoutingService,
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ModalService, useValue: mockDialogError },
        { provide: AuthService, useValue: mockAuthService },
        { provide: SupportService, useValue: mockSupportService },
        // {provide: TranslateService, useValue: mockTranslateService}
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
    fixture = TestBed.createComponent(ProductsOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Component Product order', () => {
    expect(component).toBeTruthy();
  });

  describe('Funciones', () => {
    beforeEach(() => {
    });

    it('Validar checks asociados', () => {
      component.dataSource = dataSource;
      fixture.detectChanges();
      component.validateCheckProductForSendAll(data);
    });

    it('Validar checks checks de un prodcutos estan seleccionadoss', () => {
      component.dataSource = dataSource;
      fixture.detectChanges();
      component.validateAllCheckProducts({
        products: [
          [{
            checkProductToSend: false
          }]
        ]
      });
    });

    it('Validar checks de todos los prodcutos', () => {
      component.dataSource = dataSource;
      fixture.detectChanges();
      component.checkAllProductInOrder(data);
    });

    it('Validar checks de todos los prodcutos sendAllProduct = false', () => {
      component.dataSource = dataSource;
      component.dataSource.data[0].sendAllProduct = false;
      fixture.detectChanges();
      component.checkAllProductInOrder(data);
    });

  });
});
