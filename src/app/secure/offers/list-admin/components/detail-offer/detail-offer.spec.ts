// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { MaterialModule } from '@app/material.module';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { DetailOfferComponent } from './detail-offer.component';
// import { ListAdminService } from '../../list-admin.service';
// import { of } from 'rxjs';
// import { FormBuilder } from '@angular/forms';
// import { ListAdminComponent } from '../../list-admin/list-admin.component';
// import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
// import { LoadingService } from '../../../../../core/global/loading/loading.service';
// import { ModalService, UserLoginService } from '@app/core';
// import { ShellModule } from '@app/core/shell/shell.module';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { ShellComponent } from '../../../../../core/shell/shell.component';
// import { ComponentsService } from '../../../../../shared/services/components.service';
// import { EventEmitterOrders } from '../../../../../shared/services/eventEmitter-orders.service';
// import { DynamoDBService } from '../../../../../core/aws-cognito/ddb.service';
// import { CognitoUtil } from '../../../../../core/aws-cognito/cognito.service';
// import { EndpointService } from '../../../../../core/http/endpoint.service';
// import { UserParametersService } from '../../../../../core/aws-cognito/user-parameters.service';
// import { TranslateModule } from '@ngx-translate/core';


// const detailOffer = { "total": 188, "sellerOfferViewModels": [{ "idSeller": 11811, "ean": "4995795003717", "imageUrl": "https://s3.amazonaws.com/seller.center.exito.images/imagesDev/products/319/PMK0000006147319/MK00000006147319_xl_a.jpg", "price": "15000.00", "discountPrice": "10000.00", "name": "Yoyo de Carga 3 en 1 Magic - Rojo", "stock": 970, "lastUpdate": "2019-07-19T09:30:03.835503Z", "idOffer": "636990898603920539", "promiseDelivery": "2 a 5", "shippingCost": "4000.00", "warranty": 20, "isFreeShipping": false, "isEnviosExito": false, "isFreightCalculator": false, "size": "", "hexColourCodePDP": "", "isLogisticsExito": false, "isUpdatedStock": true, "currency": "COP", "availableToOffer": true, "isProcessed": true, "nit": "26327963", "sku": "MK00000006147319" }] };

// describe('Detail offer Component ADMIN', () => {

//     const mockListService = jasmine.createSpyObj('ListAdminService', ['getListAdminOffers']);
//     const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
//     const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);

//     const formBuilder: FormBuilder = new FormBuilder();

//     // Create Variables for services and component
//     let fixture: ComponentFixture<DetailOfferComponent>;
//     let detailOfferComponent: DetailOfferComponent;
//     let loadingService: LoadingService;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 DetailOfferComponent,
//                 ShellComponent
//             ],
//             imports: [
//                 MaterialModule,
//                 ReactiveFormsModule,
//                 FormsModule,
//                 RouterTestingModule,
//                 BrowserAnimationsModule,
//                 TranslateModule.forRoot({})
//             ],
//             providers: [
//                 { provide: ListAdminService, useValue: mockListService },
//                 { provide: FormBuilder, useValue: formBuilder },
//                 EventEmitterSeller,
//                 { provide: ModalService, useValue: mockDialogError },
//                 { provide: LoadingService, useValue: mockLoadingService },
//                 ListAdminComponent,
//                 ShellComponent,
//                 ComponentsService,
//                 EventEmitterOrders,
//                 UserLoginService,
//                 DynamoDBService,
//                 CognitoUtil,
//                 EndpointService,
//                 UserParametersService
//             ],
//             schemas: [NO_ERRORS_SCHEMA]

//         }).compileComponents();


//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(DetailOfferComponent);
//         detailOfferComponent = fixture.componentInstance;
//         loadingService = TestBed.get(LoadingService);
//     });

//     it('should create detail offer component', () => {
//         expect(detailOfferComponent).toBeTruthy();
//     });

//     it('go to list offers', () => {
//         detailOfferComponent.list.viewDetailOffer = false;
//         detailOfferComponent.list.inDetail = false;
//         detailOfferComponent.goToListOffers();
//         expect(detailOfferComponent.list.viewDetailOffer).toBeFalsy();
//         expect(detailOfferComponent.list.inDetail).toBeFalsy();
//     });

//     it('press esc', () => {
//         const escapeEvent: any = document.createEvent('CustomEvent');
//         escapeEvent.which = 27;
//         escapeEvent.initEvent('keypress', true, true);
//         document.dispatchEvent(escapeEvent);
//         detailOfferComponent.handleKeyboardEvent(escapeEvent);
//     });



//     describe('List with data', () => {
//         beforeEach(() => {
//             mockListService.getListAdminOffers.and.returnValue(of(detailOffer));

//         });

//     });

// });
