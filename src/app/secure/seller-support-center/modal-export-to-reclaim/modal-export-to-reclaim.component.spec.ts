// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { ModalExportToReclaimComponent } from './modal-export-to-reclaim.component';

// import { MaterialModule } from '@app/material.module';
// import { HttpClientModule } from '@angular/common/http';
// import { SharedModule } from '@app/shared/shared.module';
// import { SortDirection, MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBarModule } from '@angular/material';
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';
// import { EndpointService, LoadingService } from '@app/core';
// import { Store } from '@ngrx/store';
// import { Observable, of, throwError } from 'rxjs';
// import { StoreService } from '@app/store/store.service';
// import { ConfigurationState } from '@app/store/configuration';
// import { ModalExportReclaimService } from '../services/modal-export-reclaim.service';
// import { DatePipe } from '@angular/common';

// const res = {
//    errors: [], data: [], message: ''
// };

// const resStore = {
//   language: 'ES',
//   statusCases: [
//             {
//               active: true,
//               code: 'Respuesta generada',
//               createDate: '2019-06-12T14:45:23.084+00:00',
//               description: 'Respuesta generada',
//               id: 6,
//               name: 'Respuesta generada',
//               updateDate: '2019-06-12T14:45:29.084+00:00',
//             }
//         ]
// };

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

// class StoreServiceTest {
//   getStateConfiguration() {
//     const configurationState: ConfigurationState = { language: 'US', statusCases: [] };
//     return of({
//         language: 'ES',
//         statusCases: [
//       {
//         active: true,
//         code: 'Respuesta generada',
//         createDate: '2019-06-12T14:45:23.084+00:00',
//         description: 'Respuesta generada',
//         id: 6,
//         name: 'Respuesta generada',
//         updateDate: '2019-06-12T14:45:29.084+00:00',
//       }
//         ]
//     });
//   }
// }

// describe('ModalExportToReclaimComponent', () => {
//   let component: ModalExportToReclaimComponent;
//   let fixture: ComponentFixture<ModalExportToReclaimComponent>;
//   let modalExportReclaimService: ModalExportReclaimService;

//   const mockExportReclaimService = jasmine.createSpyObj('ModalExportReclaimService', ['sendEmailExportReclaim']);
//   const storeServiceTest = jasmine.createSpyObj('StoreServiceTest', ['getStateConfiguration']);
//   const mockDatePipe = jasmine.createSpyObj('DatePipe', ['transform']);

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         MaterialModule,
//         ReactiveFormsModule,
//         FormsModule,
//         RouterTestingModule,
//         BrowserAnimationsModule,
//         HttpClientModule,
//         SharedModule,
//         MatSnackBarModule
//       ],
//       declarations: [ ModalExportToReclaimComponent ],
//       providers: [
//         EndpointService,
//         LoadingService,
//         { provide: Store, useClass: StoreTest },
//         { provide: StoreService, useClass: StoreServiceTest },
//         { provide: ModalExportReclaimService, useValue: mockExportReclaimService },
//         { provide: DatePipe, useValue: mockDatePipe },
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ModalExportToReclaimComponent);
//     component = fixture.componentInstance;
//     modalExportReclaimService = TestBed.get(ModalExportReclaimService);
//     mockExportReclaimService.sendEmailExportReclaim.and.returnValue(of(res));
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//   it('services modal send data', () => {
//     component.sendExportReclain();
//   });

//    describe('services modal send data data null', () => {
//     beforeEach(() => {
//       mockExportReclaimService.sendEmailExportReclaim.and.returnValue(of(null));
//     });

//     // it('save Port', () => {
//     //   component.sendExportReclain();
//     // });
//   });
// });


