// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { ExceptionBrandComponent } from './exception-brand.component';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { LoadingService } from '@app/core';
// import { BasicInformationService } from '@app/secure/products/create-product-unit/basic-information/basic-information.component.service';
// import { MaterialModule } from '@app/material.module';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
// import { of } from 'rxjs';
// import { DialogProfileComponent } from '@app/secure/seller/profiles/dialog/profile-dialog.component';
// import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

// describe('ExceptionBrandComponent', () => {

//   const mockLoadingService: LoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
//   const mockRegex = jasmine.createSpyObj('BasicInformationService', ['getRegexInformationBasic', 'getActiveBrands']);
//   const mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
//   const mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);

//   const regex = [
//     { Identifier: 'formatNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'ofertas' }
//   ];

//   const responseRegex = {
//     body: {
//       body: JSON.stringify({ Data: regex })
//     }
//   };

//   const data = {
//     title: '',
//     message: '',
//     icon: '',
//     form: null,
//     showButtons: true,
//     btnConfirmationText: null
//   };

//   let component: ExceptionBrandComponent;
//   let fixture: ComponentFixture<ExceptionBrandComponent>;
//   let dialogFixture: ComponentFixture<DialogWithFormComponent>;
//   let dialogComponent: DialogWithFormComponent;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ExceptionBrandComponent],
//       imports: [
//         MaterialModule,
//         ReactiveFormsModule,
//         FormsModule,
//         BrowserAnimationsModule
//       ],
//       providers: [
//         { provide: LoadingService, useValue: mockLoadingService },
//         { provide: BasicInformationService, useValue: mockRegex },
//         { provide: MatDialogRef, useValue: mockMatDialogRef },
//         { provide: MAT_DIALOG_DATA, useValue: data },
//         { provide: MatDialog, useValue: mockMatDialog }
//       ],
//       schemas: [NO_ERRORS_SCHEMA]
//     })
//       .compileComponents();

//     TestBed.overrideModule(BrowserDynamicTestingModule, {
//       set: {
//         entryComponents: [DialogWithFormComponent]
//       }
//     });
//     mockRegex.getRegexInformationBasic.and.returnValue(of(null));
//     mockRegex.getActiveBrands.and.returnValue(of(null));
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ExceptionBrandComponent);
//     component = fixture.componentInstance;
//     // dialogFixture = TestBed.createComponent(DialogWithFormComponent);
//     // dialogComponent = dialogFixture.componentInstance;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('With services data', () => {

//     beforeEach(() => {
//       mockRegex.getRegexInformationBasic.and.returnValue(of(responseRegex));
//       fixture.detectChanges();
//     });

//     it('Create Form with Regex', () => {
//       fixture.detectChanges();
//       fixture.whenStable().then(() => {
//         component.getRegex();
//         expect(component.regex).toEqual(regex[0].Value);
//       });
//     });

//     afterAll(() => {
//       mockRegex.getRegexInformationBasic.and.returnValue(of(null));
//     });
//   });

//   describe('Services without Data', () => {

//     beforeEach(() => {
//       mockRegex.getRegexInformationBasic.and.returnValue(of(null));
//       fixture.detectChanges();
//     });

//     // it('Create Form without Regex', () => {
//     //   expect(component.regex).toBeUndefined();
//     // });
//   });
// });
