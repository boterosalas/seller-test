// import { async, fakeAsync, tick } from '@angular/core/testing';
// import { TestBed, ComponentFixture } from '@angular/core/testing';
// import { endpoints } from '@root/api-endpoints';
// import { SupportService } from '@app/secure/support-modal/support.service';
// import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { SharedModule } from '@app/shared/shared.module';
// import { AwsCognitoRoutingModule } from '@app/secure/aws-cognito/aws-cognito.routing';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { MaterialModule } from '@app/material.module';
// import { RouterTestingModule } from '@angular/router/testing';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ShellComponent } from '@app/core/shell';

// export const registerRegex = [
//     { Identifier: 'formatIntegerNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'parametrizacion' },
// ];

// describe('endpoints', () => {

//     const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);

//     beforeEach(fakeAsync(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 CommonModule
//             ],
//             providers: [
//                 { provide: SupportService, useValue: mockSupportService },
//             ],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
//         }).compileComponents();
//     }));
//     beforeEach(() => {
//         TestBed.configureTestingModule({ });
//     });

//     it('Deberia obtener los api endpoints de desarrollo', (() => {
//         if (Object.keys(endpoints).length > 0) {
//             expect(endpoints.stage.v1).toBeDefined();
//         }
//     }));

//     it('Deberia tener el mismo numero de endpoints en produccion y en desarrollo', () => {
//         let exist = false;
//         const arrayApi = [];

//         Object.keys(endpoints.stage.v1).forEach(elementQa => {
//             exist = false;
//             Object.keys(endpoints.prod.v1).forEach(elementProd => {
//                 if (elementProd === elementQa) {
//                     exist = true;
//                 }
//             });
//             if (!exist) {
//                 arrayApi.push(elementQa);
//             }
//         });


//         Object.keys(endpoints.prod.v1).forEach(elementProd => {
//             exist = false;
//             Object.keys(endpoints.stage.v1).forEach(elementQa => {
//                 if (elementProd === elementQa) {
//                     exist = true;
//                 }
//             });
//             if (!exist) {
//                 arrayApi.push(elementProd);
//             }
//         });
//         // console.error('EndPoints faltantes', arrayApi); // No borrar, logger informativo de endpoints faltantes
//         expect(Object.keys(endpoints.stage.v1).length).toBe(Object.keys(endpoints.prod.v1).length);
//     });

//     it('Deberia ser similar la estructura de los end-points', () => {
//         if (Object.keys(endpoints.stage.v1).length === Object.keys(endpoints.prod.v1).length) {
//             let count = 0;
//             Object.keys(endpoints.stage.v1).forEach(elementQa => {
//                 if (endpoints.stage.v1[elementQa].split('/').length !== endpoints.prod.v1[Object.keys(endpoints.prod.v1)[count]].split('/').length) {
//                     console.warn('Este end point presenta una estructura diferente de QA a produccion para tener en cuenta: ' + elementQa);
//                 }
//                 count++;
//             });
//         }
//     });

// });
