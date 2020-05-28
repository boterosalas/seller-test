// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import {
//   MatFormFieldModule,
//   MatToolbarModule,
//   MatIconModule,
//   MatPaginatorModule,
//   MatSidenavModule,
//   MatAutocompleteModule,
//   MatExpansionModule,
//   MatSelectModule,
//   MatDatepicker,
//   MatDatepickerModule,
//   MatSnackBarModule,
//   MatSidenavContainer,
//   MatNativeDateModule,
//   MatInputModule,
//   MatTooltipModule,
// } from '@angular/material';
// import { ListOfCaseComponent } from './list-of-case.component';
// import { EndpointService, LoadingService, ModalService } from '@app/core';
// import { ActivatedRoute } from '@angular/router';
// import { from, of, Observable } from 'rxjs';
// import { Store } from '@ngrx/store';
// import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
// import { RouterTestingModule } from '@angular/router/testing';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CaseDetailComponent } from '@app/shared/components/case-detail/case-detail.component';
// import { CaseToolbarComponent } from '@app/shared/components/case-toolbar/case-toolbar.component';
// import { DropDownListComponent } from '@app/shared/components/drop-down-list/drop-down-list.component';
// import { SearchSellerComponent } from '@app/shared/components/search-seller/search-seller.component';
// import { TranslateModule } from '@ngx-translate/core';
// import { DropDownBoxComponent } from '@app/shared/components/drop-down-box/drop-down-box.component';
// import { CaseSummaryComponent } from '@app/shared/components/case-summary/case-summary.component';
// import { CaseFilterComponent } from '@app/shared/components/case-filter/case-filter.component';
// import { BasicCardComponent } from '@app/shared/components/basic-card/basic-card.component';
// import { ConversationMessageComponent } from '@app/shared/components/conversation-message/conversation-message.component';
// import { ConversationComponent } from '@app/shared/components/conversation/conversation.component';
// import { DropDownListHeaderComponent } from '@app/shared/components/drop-down-list-header/drop-down-list-header.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DateNoGtmPipe } from '@app/shared/pipes/date-no-gtm.pipe';
// import { MaterialModule } from '@app/material.module';
// import { FlexSizePipe } from '@app/shared/components/drop-down-list-header/flex-size.pipe';
// import { HttpClientModule } from '@angular/common/http';
// import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
// import { FlexModule } from '@angular/flex-layout';
// import { ConfigurationState } from '@app/store/configuration';
// import { CoreState } from '@app/store';
// import { StoreService } from '@app/store/store.service';
// import { StoreTestModule } from '../store-test/store-test.module';
// import { EventEmitter, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
// import { DatePipe } from '@angular/common';
// import { SupportService } from '@app/secure/support-modal/support.service';
// import { SellerSupportCenterService } from '../services/seller-support-center.service';


// describe('ListOfCaseComponent', () => {
//   let component: ListOfCaseComponent;
//   let fixture: ComponentFixture<ListOfCaseComponent>;
//   const configurationState: ConfigurationState = { language: 'US', statusCases: [] };
//   const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
//   const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
//   const mockMyProfileService = jasmine.createSpyObj('MyProfileService', ['getUser']);

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         ListOfCaseComponent,
//         CaseDetailComponent,
//         CaseToolbarComponent,
//         DropDownListComponent,
//         SearchSellerComponent,
//         DropDownBoxComponent,
//         CaseSummaryComponent,
//         CaseFilterComponent,
//         BasicCardComponent,
//         ConversationMessageComponent,
//         ConversationComponent,
//         DropDownListHeaderComponent,
//         DateNoGtmPipe,
//         FlexSizePipe
//       ],
//       imports: [
//         HttpClientModule,
//         FlexModule,
//         MatInputModule,
//         TranslateModule.forRoot({}),
//         RouterTestingModule,
//         BrowserAnimationsModule,
//         MatTooltipModule,
//         MatSidenavModule,
//         MatToolbarModule,
//         MatSnackBarModule,
//         MatFormFieldModule,
//         MatAutocompleteModule,
//         MatExpansionModule,
//         MatSelectModule,
//         MatDatepickerModule,
//         MatNativeDateModule,
//         MatIconModule,
//         MatPaginatorModule,
//         FormsModule,
//         ReactiveFormsModule,
//       ],
//       providers: [
//         DatePipe,
//         // { provide: SellerSupportCenterService, useClass: SellerSupportCenterServiceTest },
//         { provide: SupportService, useClass: SupportServiceTest },
//         EndpointService,
//         { provide: EventEmitterSeller, useClass: EventEmitterSellerTest },
//         {
//           provide: ActivatedRoute, useValue: {
//             queryParams: of(
//               {
//                 Status: ['id_params_test']
//               }
//             ),
//             snapshot: {
//               paramMap: { get: () => 1 }
//             }
//           }
//         },
//         { provide: Store, useClass: StoreTest },
//         { provide: StoreService, useClass: StoreServiceTest },
//         { provide: LoadingService, useValue: mockLoadingService },
//         { provide: ModalService, useValue: mockDialogError },
//         { provide: MyProfileService, useClass: MyProfileServiceTest },
//         { provide: MatSidenavContainer, useValue: {} },
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ListOfCaseComponent);
//     component = fixture.componentInstance;
//     component.filter = false;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });


// class StoreServiceTest {
//   getStateConfiguration() {
//     const configurationState: ConfigurationState = { language: 'US', statusCases: [] };
//     return of({
//       appConfiguration: configurationState,
//       configuration: { modules: [] },
//       notification: {
//         sumaUnreadDevolutions: 2,
//         unreadCases: 2,
//         unreadDevolutions: 2,
//         unreadPendings: 2
//       }
//     });
//   }
// }

// class StoreTest {
//   select(): Observable<any> {
//     return of(
//       {
//         notification: {
//           unreadCases: 2
//         }
//       }
//     );
//   }
// }

// class EventEmitterSellerTest {

//   eventSearchSeller = new EventEmitter<any>();
//   seller = {
//     IdSeller: 'qwe'
//   };

//   constructor() {
//     this.eventSearchSeller.next(this.seller);
//   }

//   searchSeller(seller: any) {
//     this.eventSearchSeller.emit(seller);
//   }
// }

// class MyProfileServiceTest {
//   getUser() {
//     const responseTxt =
//       JSON.stringify(
//         {
//           Data: {
//             IdSeller: 'as',
//             Profile: 'seller'
//           }
//         }
//       );
//     const response = {
//       body: { body: responseTxt }
//     };
//     return of(response);
//   }
// }

// class SupportServiceTest {
//   sendSupportMessage(user: any, supportMessage: any) {
//     const returnObj = { obk: 'qwe' };
//     return of(returnObj);
//   }

//   public getRegexFormSupport(params: any): Observable<any> {
//     const responseTxt = JSON.stringify({ Data: ['reclamaciones'] });
//     const response = { body: { body: responseTxt } };
//     return of(response);
//   }

//   public getClassification(): Observable<any> {
//     const classification = {
//       class: 'we'
//     };
//     return of(classification);
//   }
// }
