import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { CognitoUtil, EndpointService, LoadingService, UserLoginService, UserParametersService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { of } from 'rxjs';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { UploadFileMasiveComponent } from './upload-file-masive.component';
import { UploadFileMasiveService } from './upload-file-masive.service';

describe('uploadFileMasiveComponent', () => {

  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
  const mockStoresService = jasmine.createSpyObj('StoresService', ['getAllStoresFull', 'getAllStores']);
  const mockUploadFileMasiveService = jasmine.createSpyObj('UploadFileMasiveService', ['uploadFile', 'status']);
  const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
  const mockMyProfileService = jasmine.createSpyObj('MyProfileService', ['getUser']);
  let component: UploadFileMasiveComponent;
  let fixture: ComponentFixture<UploadFileMasiveComponent>;

  const response = {
    data: true,
    errors: [],
    message: null,
    pendingResponse: false,
  };
  const responseUploadFile = {
    body: '{"Errors":[],"Data":{"Errors":[],"Data":true,"Message":""},"Message":"Operación realizada éxitosamente."}',
    isBase64Encoded: false,
    statusCode: 200
  };

  const responseStatus = {
    body: '{"Errors":[],"Data":{"IdSeller":1,"Status":2,"Response":"{\"TotalProcess\":1,\"Error\":0,\"Successful\":1,\"FileName\":\"\",\"Errors\":[]}","Checked":"False"},"Message":"Operación realizada éxitosamente."}',
    isBase64Encoded: false,
    statusCode: 200
  };


  const respondeRegex = {
    body: {
      body: '{"Errors":[],"Data":[],"Message":""}',
      isBase64Encoded: false,
      statusCode: 200
    },
    ok: true,
    status: 200,
    statusText: 'OK',
    type: 4
  };

  const data = {
    initTime: 500,
    intervalTime: 10000,
    title: 'Cargar categorías',
    positionTitle: 'center',
    subTitle: 'Por favor seleccione el archivo de categorías que desea cargar',
    positionSubtitle: 'left',
    dragDrop: {
      msg: 'Presione acá o arrastre y suelte el archivo',
      accept: '.xlsx, .xls, .ods'
    },
    btn: {
      btn_1: '',
      btn_2: ''
    },
    services: {
      send: {
        name: 'createUpdateMassiveCategories',
        method: 'post'
      },
      status: {
        name: 'ValidateStatusCreateUpdateMassive',
        method: 'get'
      }
    },
    uploadStatus: {
      success: {
        title: 'Carga exitosa',
        subTile: 'El archivo con la información de categorias se ha cargado exitosamente',
        icon: 'check_circle',
        colorStatus: '#485AFA',
        btn: [
          {
            btnTitle: 'Aceptar',
            action: 'close',
            style: 'raised',
          }
        ]
      },
      proccess: {
        title: 'Carga en proceso',
        subTile: null,
        icon: 'autorenew',
        colorStatus: '#485AFA',
        btn: [
          {
            btnTitle: 'Ir al inicio',
            action: 'goToHome',
            style: 'raised',
          }
        ]
      },
      error: {
        title: 'Ha ocurrido un error al momento de cargar el archivo de categorías',
        subTile: null,
        icon: 'report_problem',
        nameFile: 'Bulk_load_category',
        btn: [
          {
            btnTitle: 'Cerrar',
            action: 'close',
            style: 'raised',
          },
          {
            btnTitle: 'Exportar a exccel',
            action: 'exportExcel',
            style: 'raised',
          }
        ]
      }
    }
  };

  const reponseSYNC = {
    body: {
      body: '{"Message":"OK","Errors":[],"Data":{"IdSeller":1,"Name":"Madrid Emperador","DaneCode":"12345670","Address":null,"GotoExito":false,"GotoCarrulla":false,"GotoCatalogo":false,"IsShippingExito":true,"IsLogisticsExito":true,"Nit":"54813456222","Email":"avecesar@emperador.com","Status":"Enable","StartVacations":"0001-01-01T00:00:00","EndVacations":"0001-01-01T00:00:00","City":"","Country":null,"Payoneer":null,"DaneCodesNonCoverage":null,"Profile":"administrator","IdDispatchPort":0},"SellerId":null}',
      isBase64Encoded: false,
      statusCode: 200,
    }
  };

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
      declarations: [UploadFileMasiveComponent],
      providers: [
        { provide: StoresService, useValue: mockStoresService },
        EndpointService,
        UserParametersService,
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: UploadFileMasiveService, useValue: mockUploadFileMasiveService },
        { provide: SupportService, useValue: mockSupportService },
        { provide: MyProfileService, useValue: mockMyProfileService },
        ShellComponent,
        ComponentsService,
        EventEmitterOrders,
        CognitoUtil
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileMasiveComponent);
    mockStoresService.getAllStores.and.returnValue(of(response));
    mockUploadFileMasiveService.uploadFile.and.returnValue(of(responseUploadFile));
    mockUploadFileMasiveService.status.and.returnValue(of(responseStatus));
    mockSupportService.getRegexFormSupport.and.returnValue(of(respondeRegex));
    mockMyProfileService.getUser.and.returnValue(of(reponseSYNC));
    component = fixture.componentInstance;
    component.data = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
