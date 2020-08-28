import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LoadingService, ModalService, EndpointService, UserParametersService, CognitoUtil, UserLoginService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '@app/secure/auth/auth.routing';
import { of, throwError } from 'rxjs';
import { SortDirection, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { SharedModule } from '@app/shared/shared.module';
import { CalificationService } from '../quality.service';
import { CalificationListComponent } from './calification-list.component';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { StoresService } from '@app/secure/offers/stores/stores.service';

export const registerRegex = [
  { Identifier: 'formatIntegerNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'parametrizacion' },
];

describe('CalificationListComponent', () => {

  const mockCalificationService = jasmine.createSpyObj('CalificationService', ['getOrderList', 'getListCalificationsBySeller', 'delete', 'notificate']);
  const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
  const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
  const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
  const mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
  const formBuilder: FormBuilder = new FormBuilder();
  const data = {
    title: '',
    message: '',
    icon: '',
    form: null,
    btnConfirmationText: null,
    showButtons: false
  };

  const registerMenu = {
    Functionalities: [{
      NameFunctionality: 'Crear',
      ShowFunctionality: true,
      nameFunctionalityBack: 'Crear'
    }],
  };

  const model = {
    viewModel: [
      {
        quantitative: 5,
        qualificationPromiseDelivery: {
          numerator: 45,
          denominator: 45,
          percentage: 100,
          qualification: 5,
          qualificationPercentage: 0,
          total: 2,
          percentagePenalty: 200,
          valuePenalty: 0
        },
        qualificationCase: {
          numerator: 1,
          denominator: 45,
          percentage: 2,
          qualification: 5,
          qualificationPercentage: 0,
          total: 1,
          percentagePenalty: 0,
          valuePenalty: 0
        },
        qualificationCanceled :{
          numerator: 0,
          denominator: 45,
          percentage: 0,
          qualification: 5,
          qualificationPercentage: 0,
          total: 1,
          percentagePenalty: 200,
          valuePenalty: 0
        },
        detail: {
          ordersOutsideDeliveryDate: null,
          ordersCanceledBySellerResponsibility: null,
          orderWithPqr: null
        },
        idSeller: 10108,
        sellerName: 'Leonisa',
        qualificationDate: 201912,
        generatedDate: 202002,
        urlFile: 'https://s3.amazonaws.com/seller.center.exito.seller/qualificationDev/10108_diciembre_2019_{0}.html',
        qualitative: 'Excelente'
      }
    ],
    count: 2,
    paginationToken: '{}',
    paginationTokens: null
  };


  const response = {
    body: '{"Message":"Operación realizada éxitosamente.","Errors":[],"Data":{ "Brands":[{"Id":636934381618814126,"Name":"---------","Status":0,"IdVTEX":"2000500","UpdateStatus":false}, {"Id":636934381618814126,"Name":"---------","Status":1,"IdVTEX":"2000500","UpdateStatus":false}]}}',
    headers: null,
    isBase64Encoded: false,
    multiValueHeaders: null,
    statusCode: 200
  };

  const responseNotificate = {
    body: '',
    headers: null,
    isBase64Encoded: false,
    multiValueHeaders: null,
    statusCode: 200
  };

  const filter = {
    dateInitQualityMonth: '202002'
  };
    const filterBrands = new FormGroup({
        filterBrandsId: new FormControl('636934381618814126'),
        filterBrandsName: new FormControl('---------'),
    });

  let calificationComponent: CalificationListComponent;
  let fixture: ComponentFixture<CalificationListComponent>;

  let calificationService: CalificationService;
  let dialogFixture: ComponentFixture<DialogWithFormComponent>;
  let dialogComponent: DialogWithFormComponent;
  let supportService: SupportService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [
        CalificationListComponent,
      ],
      providers: [
        { provide: CalificationService, useValue: mockCalificationService },
        EndpointService,
        EventEmitterOrders,
        { provide: LoadingService, useValue: mockLoadingService },
        SupportService,
        { provide: AuthService, useValue: mockAuthService },
        UserParametersService,
        CognitoUtil,
        ComponentsService,
        StoresService,
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: ModalService, useValue: mockDialogError },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: FormBuilder, useValue: formBuilder },
        ShellComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [DialogWithFormComponent]
      }
    });
  }));

  beforeEach(fakeAsync(() => {
    mockAuthService.getMenu.and.returnValue(registerMenu);
    fixture = TestBed.createComponent(CalificationListComponent);
    calificationComponent = fixture.componentInstance;
    calificationService = TestBed.get(CalificationService);
    supportService = TestBed.get(SupportService);
    dialogFixture = TestBed.createComponent(DialogWithFormComponent);
    dialogComponent = dialogFixture.componentInstance;
    mockSupportService.getRegexFormSupport.and.returnValue(of(registerRegex));
    mockCalificationService.getListCalificationsBySeller.and.returnValue(of(model));
    mockCalificationService.notificate.and.returnValue(of(responseNotificate));
    calificationComponent.detailByElemet = model;
    calificationComponent.filterCalifications = formBuilder.group({
      dateInitQualityMonth: '202002'
    });
    fixture.detectChanges();
  }));

  // it('should create', () => {
  //   expect(calificationComponent).toBeTruthy();
  // });
  describe('diferentes calificaciones', () => {
    beforeEach(fakeAsync(() => {
      mockCalificationService.getListCalificationsBySeller.and.returnValue(of(model));
    }));

    it('1', () => {
      const params = {
        'limit': 50 + '&paginationToken={}',
        'idSeller': 10108,
        'dateInitQualityMonth': 202020,
        'dateFinalQualityMonth': 202020,
        'dateInitQualityIssued': 202020,
        'dateFinalQualityIssued': 202020,
      };
      calificationComponent.getCalificationsBySeller(params);
    });
    it('2', () => {
      calificationComponent.contentDetails('202020', 101008);
    });
    it('3', () => {
      calificationComponent.clearForm();
    });
    it('4', () => {
      calificationComponent.arrayPosition = [{}, {}];
      fixture.detectChanges();
      calificationComponent.validateArrayPositionPaginationToken();
    });
    it('5', () => {
    calificationComponent.backListCalifications();
    });
  });
});
