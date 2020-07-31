// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { PendingProductsComponent } from './pending-products.component';
// import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
// import { MaterialModule } from '@app/material.module';
// import { RouterTestingModule } from '@angular/router/testing';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { HttpClientModule } from '@angular/common/http';
// import { SharedModule } from '@app/shared/shared.module';
// import { MatSnackBarModule } from '@angular/material';
// import { UserParametersService, LoadingService } from '@app/core';
// import { AuthService } from '@app/secure/auth/auth.routing';
// import { PendingProductsService } from './pending-products.service';
// import { SupportService } from '@app/secure/support-modal/support.service';
// import { of } from 'rxjs';
// import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

// export const registerRegex = [
//     { Identifier: 'nameProduct', Value: '^([\sa-zA-Z0-9áéíóúñÁÉÍÓÚÑ+-_\-\,\.](?![/])){1,80}$', Module: 'productos' },
// ];

// const resValidation = {
//     count: 2,
//     paginationToken: '{}',
//     paginationTokens: [],
//     viewModel: [
//         {
//             dateProcess: '2020-07-27',
//             ean: 'IZ20000065867',
//             imageUrl: 'https://www.kalley.com.co/sites/default/files/silver-max-negro1_0.jpg',
//             name: 'nuevo',
//             parentReference: ''
//         },
//         {
//             dateProcess: '2020-07-27',
//             ean: 'IZ20000065869',
//             imageUrl: 'https://www.kalley.com.co/sites/default/files/silver-max-negro1_0.jpg',
//             name: 'nuevo',
//             parentReference: ''
//         }
//     ]
// };

// const resModify = {
//     count: 2,
//     paginationToken: '{}',
//     paginationTokens: [],
//     viewModel: [
//         {
//             dateProcess: '2020-07-27',
//             ean: 'IZ20000065867',
//             imageUrl: 'https://www.kalley.com.co/sites/default/files/silver-max-negro1_0.jpg',
//             name: 'nuevo',
//             parentReference: ''
//         },
//         {
//             dateProcess: '2020-07-27',
//             ean: 'IZ20000065869',
//             imageUrl: 'https://www.kalley.com.co/sites/default/files/silver-max-negro1_0.jpg',
//             name: 'nuevo',
//             parentReference: ''
//         }
//     ]
// };

// const data = {
//     sellerId: '11618',
//     sellerProfile: 'seller',
//     sellerNit: '123',
//     sellerName: 'la tienda de cristian 2019 vs 512',
//     sellerEmail: 'ccbustamante221@misena.edu.co',
//   };

// describe('PendingProductsComponent', () => {
//     let component: PendingProductsComponent;
//     let fixture: ComponentFixture<PendingProductsComponent>;


//     const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
//     const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
//     const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
//     const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
//     const mockPendingProductsService = jasmine.createSpyObj('PendingProductsService', ['getPendingProductsModify', 'getPendingProductsValidation']);


//     const formBuilder: FormBuilder = new FormBuilder();


//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 MaterialModule,
//                 ReactiveFormsModule,
//                 FormsModule,
//                 RouterTestingModule,
//                 BrowserAnimationsModule,
//                 HttpClientModule,
//                 SharedModule,
//                 MatSnackBarModule
//             ],
//             declarations: [PendingProductsComponent],
//             providers: [
//                 { provide: UserParametersService, useValue: mockUserParameterService },
//                 { provide: AuthService, useValue: mockAuthService },
//                 { provide: LoadingService, useValue: mockLoadingService },
//                 { provide: SupportService, useValue: mockSupportService },
//                 { provide: FormBuilder, useValue: formBuilder },
//                 { provide: PendingProductsService, useValue: mockPendingProductsService },
//             ],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(PendingProductsComponent);
//         mockSupportService.getRegexFormSupport.and.returnValue(of(registerRegex));
//         mockPendingProductsService.getPendingProductsModify.and.returnValue(of(resModify));
//         mockPendingProductsService.getPendingProductsValidation.and.returnValue(of(resValidation));
//         mockUserParameterService.getUserData.and.returnValue(of(data));
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
