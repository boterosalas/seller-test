import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LoadingService, ModalService, EndpointService, UserParametersService, CognitoUtil, UserLoginService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DetailCalificationComponent } from './detail-calification.component';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '@app/secure/auth/auth.routing';
import { of, throwError } from 'rxjs';
import { SortDirection, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { SharedModule } from '@app/shared/shared.module';
import { CalificationService } from '../../quality.service';

export const registerRegex = [
  { Identifier: 'formatIntegerNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'parametrizacion' },
];

fdescribe('DetailCalificationComponent', () => {

  const mockCalificationService = jasmine.createSpyObj('CalificationService', ['getOrderList', 'getListCalificationsBySeller', 'delete', 'notificate']);
  const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
  const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
  const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
  const mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
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


  const detail = {
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
    qualificationCanceled: {
      numerator: 0,
      denominator: 46,
      percentage: 0,
      qualification: 5,
      qualificationPercentage: 0,
      total: 1,
      percentagePenalty: 200,
      valuePenalty: 0
    },
    detail: {
      ordersOutsideDeliveryDate: [
        {
          orderNumber: '12345',
          orderDate: 202002,
          MaxDeliveryDate: 202020,
          DeliveryDate: 202020,
          DelayDays: 3,
          CustomerIdentificationCard: '123454687',
          CustomerName: 'Aristóbulo XD',
          Penalty: 145612,
          TotalCommission: 1456423
        }
      ],
      ordersCanceledBySellerResponsibility:
      [
        {
          caseId: '5001U00000TI91WQAT',
          orderNumber: '705664513',
          orderDate: '2019-11-05T21:27:08.61+00:00',
          maxDeliveryDate: '0001-01-01T00:00:00',
          orderStatus: 'Cancelado',
          idOrderStatus: 80,
          reasonPqr: 'Servicio Posventa',
          pqrDate: '2020-01-23T00:00:00+00:00',
          customerIdentificationCard: '1000203784',
          customerName: null,
          penalty: 5174,
          totalCommission: 2587,
        }
      ],
      ordersWithPqr: [
        {
          caseId: '5001U00000TI91WQAT',
          orderNumber: '705664513',
          orderDate: '2019-11-05T16:27:08.61+00:00',
          maxDeliveryDate: '0001-01-01T00:00:00',
          orderStatus: 'Cancelado',
          idOrderStatus: 80,
          reasonPqr: 'Servicio Posventa',
          pqrDate: '2020-01-23T00:00:00+00:00',
          customerIdentificationCard: '1000203784',
          customerName: 'Wilinton ',
          penalty: 0,
          totalCommission: 0,
          sku: 'SKUMP01080002954',
        }
      ]
    },
    idSeller: 10108,
    sellerName: 'Leonisa',
    qualificationDate: 201912,
    generatedDate: 202002,
    urlFile: 'https://s3.amazonaws.com/seller.center.exito.seller/qualificationDev/10108_diciembre_2019_{0}.html',
    qualitative: 'Excelente'
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



  let fixture: ComponentFixture<DetailCalificationComponent>;
  let detailCalificationComponent: DetailCalificationComponent;
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
        HttpClientModule,
        SharedModule
      ],
      declarations: [
        DetailCalificationComponent,
      ],
      providers: [
        { provide: CalificationService, useValue: mockCalificationService },
        EndpointService,
        { provide: LoadingService, useValue: mockLoadingService },
        SupportService,
        { provide: AuthService, useValue: mockAuthService },
        UserParametersService,
        CognitoUtil,
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: ModalService, useValue: mockDialogError },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: mockDialogRef },
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
    fixture = TestBed.createComponent(DetailCalificationComponent);
    detailCalificationComponent = fixture.componentInstance;
    calificationService = TestBed.get(CalificationService);
    supportService = TestBed.get(SupportService);
    dialogFixture = TestBed.createComponent(DialogWithFormComponent);
    dialogComponent = dialogFixture.componentInstance;
    mockSupportService.getRegexFormSupport.and.returnValue(of(registerRegex));
    mockCalificationService.getListCalificationsBySeller.and.returnValue(of(response));
    mockCalificationService.notificate.and.returnValue(of(responseNotificate));
    detailCalificationComponent.detailByElemet = detail;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(detailCalificationComponent).toBeTruthy();
    expect(detailCalificationComponent).toBeTruthy();
  });
  describe('diferentes calificaciones', () => {
    beforeEach(() => {
    });

    it('setea color >= 3 && < 5', () => {
        detailCalificationComponent.setClassColorByCalification(3);
    });
    it('setea color < 3 ', () => {
        detailCalificationComponent.setClassColorByCalification(1);
    });
    it('recalculate ', () => {
        detailCalificationComponent.recalculateQualitative();
    });
    it('notificate ', () => {
        detailCalificationComponent.notificateSeller();
    });
  });
});
