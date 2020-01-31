// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialogRef, MatDialogModule, MatInputModule, MatIconModule, MatSnackBarModule } from '@angular/material';
// import { SellerRatingComponent } from './seller-rating.component';
// import { MaterialModule } from '@app/material.module';
// import { TranslateModule } from '@ngx-translate/core';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { SharedModule } from '@app/shared/shared.module';
// import { CommonModule } from '@angular/common';
// import { RouterTestingModule } from '@angular/router/testing';
// import { LoadingService, UserParametersService } from '@app/core';
// import { SupportService } from '@app/secure/support-modal/support.service';
// import { DashboardService } from '../services/dashboard.service';
// import { of } from 'rxjs';

// export const registerRegex = [
//   { Identifier: 'dateMonthYear', Value: '^(0[0-9]||1[0-2])\/([0-9]{4})$', Module: 'dashboard' },
// ];

// fdescribe('SellerRatingComponent', () => {
//   let component: SellerRatingComponent;
//   let fixture: ComponentFixture<SellerRatingComponent>;

//   const UserInformation = {
//     sellerEmail: 'ccbustamante2@misena.edu.co',
//     sellerId: '11618',
//     sellerName: 'la tienda de cristian 2019 vs 5',
//     sellerNit: '1128438122',
//     sellerProfile: 'seller',
// };

// const resRegex = {
//   body: {
//       body: JSON.stringify({ Data: registerRegex })
//   }
// };

//   const dialogMock = { close: () => { } };
//   const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
//   const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
//   const mockSuportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
//   const mockDashboardService = jasmine.createSpyObj('DashboardService', ['getRatingSellers']);

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ SellerRatingComponent ],
//       imports: [MaterialModule,
//         ReactiveFormsModule,
//         FormsModule,
//         MatDialogModule,
//         HttpClientModule,
//         CommonModule,
//         ReactiveFormsModule,
//         MatIconModule,
//         MatSnackBarModule,
//         MatInputModule,
//         SharedModule,
//         RouterTestingModule,
//         TranslateModule.forRoot({})
//       ],
//       providers: [
//         { provide: MatDialogRef, useValue: dialogMock },
//         { provide: LoadingService, useValue: mockLoadingService },
//         { provide: UserParametersService, useValue: mockUserParameterService },
//         // UserParametersService,
//         { provide: SupportService, useValue: mockSuportService },
//         { provide: DashboardService, useValue: mockDashboardService },
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SellerRatingComponent);
//     component = fixture.componentInstance;
//     mockUserParameterService.getUserData.and.returnValue(UserInformation.sellerId);
//     mockSuportService.getRegexFormSupport.and.returnValue(of(resRegex));
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
