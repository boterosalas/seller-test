// /* 3rd party components */
// import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

// /* our own custom components */
// import { SupportModalComponent } from './support-modal.component';
// import { MatDialogRef } from '@angular/material';
// import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ComponentsService, UserInformation } from '@app/shared';
// import { SupportService } from './support.service';
// import {
//   UserParametersService,
//   EndpointService,
//   LoadingService
// } from '@app/core';
// import { MaterialModule } from '@app/material.module';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SharedModule } from '@app/shared/shared.module';

// describe('SupportModalComponent', () => {
//   let component: SupportModalComponent;
//   let fixture: ComponentFixture<SupportModalComponent>;

//     const userInfo = new UserInformation();
//     userInfo.sellerNit = '123';
//     userInfo.sellerName = 'Luis Miguel';

//   const mockPromise = new Promise<UserInformation>(async resolve => {
//     resolve(this.userInfo);
//   });

//   const COMPONENT = <ComponentsService>{};

//   const SUPPORT = <SupportService>{};

//     const userParams = <UserParametersService>{
//       getUserData(): Promise<any> {
//         return mockPromise;
//       }
//     };

//   const endpointService = <EndpointService>{
//     get: (name: string, params?: any[], version: string = null): string => ''
//   };

//   const loadingService = <LoadingService>{};

//   beforeEach(fakeAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         SupportModalComponent
//         // SupportModule
//       ],
//       providers: [
//         { provide: FormBuilder, useValue: {} },
//         { provide: ComponentsService, useValue: COMPONENT },
//         { provide: SupportService, useValue: SUPPORT },
//         { provide: UserParametersService, useValue: userParams },
//         { provide: LoadingService, useValue: loadingService },
//         { provide: EndpointService, useValue: endpointService },
//         { provide: MatDialogRef, useValue: {} }
//       ],
//       imports: [
//         MaterialModule,
//         FormsModule,
//         CommonModule,
//         ReactiveFormsModule,
//         HttpClientModule,
//         BrowserAnimationsModule,
//         SharedModule
//         // SupportModule,
//       ]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SupportModalComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create SupportModalComponent', (done) => {
//     expect(component).toBeTruthy();
//     done();
//   });

//   afterEach(() => {
//     fixture.destroy();
//   });
// });
