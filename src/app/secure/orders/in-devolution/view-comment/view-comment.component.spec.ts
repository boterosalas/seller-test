/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { ViewCommentComponent } from './view-comment.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { InDevolutionService } from '../in-devolution.service';


const result = {
  clientAddress: 'cra 47 a # 76 sur 48 SABANETA , Sabaneta, ANTIOQUIA, Colombia',
  clientName: 'maritza',
  clientObservation: null,
  clientTelephone: '+573152880606',
  creationDate: '2019-12-31T16:23:42.447+00:00',
  id: '637158302764227005',
  idSeller: 11226,
  identificationCard: '42566777',
  maximumDeliveryDate: '2019-12-31T16:23:42.447+00:00',
  orderDate: '2019-11-26T16:08:04.337+00:00',
  orderNumber: '979170436044',
  registryTranslations: {
    'en-US#SellerObservationReversionRequestRefuse': 'does not correspond to what was raised in the hiring'
  },
  resolutionDate: '2020-01-08T16:08:04.337+00:00',
  reversionRequestDetailViewModel:{
    detailSubOrderMarketplaceId: '29095',
    productName: 'Celular Oneplus',
    reference: null,
    requestedAmount: 1,
    reverseAmount: 1,
    reversionRequestDetailId: '22508',
    sku: '100239813'
  },
  reversionRequestId: '22363',
  reversionRequestReason: 'Motivo de la solicitud no aplica para devolución',
  reversionRequestReasonId: 19,
  reversionRequestStatus: 'RejectedSeller',
  reversionRequestStatusId: 4,
  reversionRequestType: 'Cancelacion',
  reversionRequestTypeId: 2,
  sacObservationReceiptRefuse: null,
  sacObservationReversionRequestRefuse: 'Se acuerda devolución con el cliente',
  sellerObservationReceiptRefuse: null,
  sellerObservationReversionRequestRefuse: 'no corresponde a lo que se planteó en la contratación',
  typeReturn: 'Sustituto',
  typeReturnId: 5
};
describe('ViewCommentComponent', () => {
  let component: ViewCommentComponent;
  let fixture: ComponentFixture<ViewCommentComponent>;

  const mockInDevolutionService = jasmine.createSpyObj('InValidationService', ['getOrders', 'acceptDevolution', 'reportNovelty', 'getAllCommentRefuse']);
  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({}),
      ], declarations: [
        ViewCommentComponent
      ], providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: InDevolutionService, useValue: mockInDevolutionService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCommentComponent);
    mockInDevolutionService.getAllCommentRefuse.and.returnValue(of(result));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dialog should be closed after onNoClick()', () => {
    component.onNoClick();
    expect(component).toBeTruthy();
  });
});

